const express = require('express');
const router = express.Router();
const db = require('../db');
const fetch = require('node-fetch');
const { authenticateToken } = require('../middleware/auth');
const { validateCheckout } = require('../validators');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

// Obtener órdenes (requiere autenticación)
router.get('/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { role, id: userId } = req.user;
    
    let orders;
    if (role === 'admin') {
      // Admin puede ver todas las órdenes con detalles
      orders = db.prepare(`
        SELECT 
          o.*, 
          u.name as user_name, u.email as user_email,
          GROUP_CONCAT(
            p.name || ' (x' || oi.qty || ')'
          ) as items_summary
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `).all();
    } else {
      // Usuario normal solo ve sus órdenes
      orders = db.prepare(`
        SELECT 
          o.*,
          GROUP_CONCAT(
            p.name || ' (x' || oi.qty || ')'
          ) as items_summary
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `).all(userId);
    }
    
    res.json(orders);
  })
);

// Checkout con validación y gestión thread-safe de stock
router.post('/checkout',
  validateCheckout,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { userId, items, payment_method, wallet_email, paypal } = req.body;
    
    // Usar transacción para operaciones atómicas
    const transaction = db.transaction(() => {
      let total = 0;
      const stockUpdates = [];
      
      // Verificar stock y calcular total
      for (const item of items) {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
        
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }
        
        if (product.stock < item.qty) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}, solicitado: ${item.qty}`);
        }
        
        total += product.price_cents * item.qty;
        stockUpdates.push({ 
          productId: item.productId, 
          qty: item.qty, 
          price: product.price_cents,
          name: product.name
        });
      }
      
      return { total, stockUpdates };
    });
    
    let total, stockUpdates;
    
    try {
      // Ejecutar verificaciones en transacción
      const result = transaction();
      total = result.total;
      stockUpdates = result.stockUpdates;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Procesar pago según el método
    if (payment_method === 'wallet') {
      try {
        const resp = await fetch('http://wallet:4100/api/wallet/charge', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ 
            email: wallet_email, 
            amount_cents: total 
          })
        });
        
        if (resp.status !== 200) {
          const errorData = await resp.json().catch(() => ({ error: 'Error de comunicación con wallet' }));
          return res.status(400).json({ 
            error: 'Error en pago con wallet', 
            detail: errorData 
          });
        }
      } catch (error) {
        return res.status(500).json({ 
          error: 'Error conectando con servicio de wallet',
          detail: error.message
        });
      }
    } else if (payment_method === 'paypal') {
      try {
        const resp = await fetch('http://payment:4001/api/payments/create', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            amount_cents: total,
            return_url: paypal?.return_url || 'http://localhost:5173',
            cancel_url: paypal?.cancel_url || 'http://localhost:5173'
          })
        });
        
        const paymentData = await resp.json();
        
        if (!paymentData.approval_url) {
          return res.status(500).json({ error: 'Error creando pago PayPal' });
        }
        
        return res.json({ 
          ok: true, 
          payment: paymentData,
          total_cents: total
        });
      } catch (error) {
        return res.status(500).json({
          error: 'Error conectando con servicio de pagos',
          detail: error.message
        });
      }
    }
    
    // Crear orden (solo si el pago fue exitoso)
    const createOrderTransaction = db.transaction(() => {
      const now = new Date().toISOString();
      
      // Crear orden
      const orderInfo = db.prepare(
        'INSERT INTO orders (user_id, total_cents, created_at) VALUES (?, ?, ?)'
      ).run(userId || null, total, now);
      
      const orderId = orderInfo.lastInsertRowid;
      
      // Insertar items de la orden y actualizar stock
      const insertItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, qty, unit_price_cents) VALUES (?, ?, ?, ?)'
      );
      
      const updateStock = db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?'
      );
      
      for (const stockUpdate of stockUpdates) {
        // Insertar item de orden
        insertItem.run(orderId, stockUpdate.productId, stockUpdate.qty, stockUpdate.price);
        
        // Actualizar stock con verificación adicional
        const result = updateStock.run(stockUpdate.qty, stockUpdate.productId, stockUpdate.qty);
        
        if (result.changes === 0) {
          throw new Error(`Error actualizando stock para ${stockUpdate.name}`);
        }
      }
      
      return orderId;
    });
    
    try {
      const orderId = createOrderTransaction();
      
      res.json({
        ok: true,
        orderId,
        total_cents: total,
        message: 'Orden creada exitosamente'
      });
    } catch (error) {
      console.error('Error creando orden:', error);
      return res.status(500).json({ 
        error: 'Error creando la orden',
        detail: error.message
      });
    }
  })
);

// endpoint to execute paypal payment after user approves
router.post('/execute-paypal', async (req,res)=>{
  try{
    const { paymentId, payerId, userId, items } = req.body;
    // call payment service to execute
    const resp = await fetch('http://payment:4001/api/payments/execute', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ paymentId, payerId }) });
    const json = await resp.json();
    if(json.status !== 'COMPLETED') return res.status(400).json({ error: 'Payment not completed' });
    // create order same as above
    let total = 0; for(const it of items){ const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId); total += p.price_cents * it.qty; }
    const now = new Date().toISOString(); const info = db.prepare('INSERT INTO orders (user_id,total_cents,created_at) VALUES (?,?,?)').run(userId||null,0,now); const orderId = info.lastInsertRowid; const insertItem = db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)'); for(const it of items){ const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId); insertItem.run(orderId,it.productId,it.qty,p.price_cents); db.prepare('UPDATE products SET stock = stock - ? WHERE id=?').run(it.qty,it.productId); } db.prepare('UPDATE orders SET total_cents = ? WHERE id=?').run(total,orderId); res.json({ ok:true, orderId, total_cents: total, transaction: json });
  }catch(e){ console.error(e); res.status(500).json({ error: e.message }); }
});

module.exports = router;
