const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateCartItem } = require('../validators');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

// Función para obtener session_id de las cookies o crear uno nuevo
function getSessionId(req) {
  return req.headers['x-session-id'] || req.session?.id || 'anonymous-' + Date.now();
}

// Obtener items del carrito
router.get('/', asyncHandler(async (req, res) => {
  const sessionId = getSessionId(req);
  const userId = req.user?.id || null;
  
  const cartItems = db.prepare(`
    SELECT 
      ci.id, ci.product_id as productId, ci.qty, ci.created_at,
      p.name, p.category, p.price_cents, p.stock, p.image_url, p.supplier_id,
      s.name as supplier_name
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE (ci.session_id = ? OR (ci.user_id = ? AND ? IS NOT NULL))
    ORDER BY ci.created_at DESC
  `).all(sessionId, userId, userId);
  
  // Formatear respuesta para mantener compatibilidad
  const formattedItems = cartItems.map(item => ({
    productId: item.productId,
    qty: item.qty,
    product: {
      id: item.productId,
      name: item.name,
      category: item.category,
      price_cents: item.price_cents,
      stock: item.stock,
      image_url: item.image_url,
      supplier_id: item.supplier_id,
      supplier_name: item.supplier_name
    }
  }));
  
  res.json(formattedItems);
}));

// Añadir item al carrito
router.post('/',
  validateCartItem,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { productId, qty } = req.body;
    const sessionId = getSessionId(req);
    const userId = req.user?.id || null;
    
    // Verificar que el producto existe y tiene stock suficiente
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    if (product.stock < qty) {
      return res.status(400).json({ 
        error: 'Stock insuficiente', 
        available: product.stock 
      });
    }
    
    // Verificar si ya existe en el carrito
    const existingItem = db.prepare(`
      SELECT * FROM cart_items 
      WHERE product_id = ? AND (session_id = ? OR (user_id = ? AND ? IS NOT NULL))
    `).get(productId, sessionId, userId, userId);
    
    if (existingItem) {
      // Actualizar cantidad existente
      const newQty = existingItem.qty + qty;
      
      if (product.stock < newQty) {
        return res.status(400).json({ 
          error: 'Stock insuficiente para la cantidad total', 
          available: product.stock,
          currentInCart: existingItem.qty
        });
      }
      
      db.prepare(`
        UPDATE cart_items 
        SET qty = ?, created_at = datetime('now') 
        WHERE id = ?
      `).run(newQty, existingItem.id);
    } else {
      // Crear nuevo item
      db.prepare(`
        INSERT INTO cart_items (session_id, user_id, product_id, qty, created_at) 
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(sessionId, userId, productId, qty);
    }
    
    res.json({ ok: true, message: 'Producto añadido al carrito' });
  })
);

// Actualizar cantidad de un item
router.put('/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { qty } = req.body;
    const sessionId = getSessionId(req);
    const userId = req.user?.id || null;
    
    if (!qty || qty < 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }
    
    // Si qty es 0, eliminar item
    if (qty === 0) {
      db.prepare(`
        DELETE FROM cart_items 
        WHERE product_id = ? AND (session_id = ? OR (user_id = ? AND ? IS NOT NULL))
      `).run(productId, sessionId, userId, userId);
      
      return res.json({ ok: true, message: 'Item eliminado del carrito' });
    }
    
    // Verificar stock
    const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(productId);
    if (!product || product.stock < qty) {
      return res.status(400).json({ 
        error: 'Stock insuficiente', 
        available: product?.stock || 0 
      });
    }
    
    // Actualizar cantidad
    const result = db.prepare(`
      UPDATE cart_items 
      SET qty = ?, created_at = datetime('now') 
      WHERE product_id = ? AND (session_id = ? OR (user_id = ? AND ? IS NOT NULL))
    `).run(qty, productId, sessionId, userId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }
    
    res.json({ ok: true, message: 'Carrito actualizado' });
  })
);

// Limpiar carrito
router.post('/clear', asyncHandler(async (req, res) => {
  const sessionId = getSessionId(req);
  const userId = req.user?.id || null;
  
  db.prepare(`
    DELETE FROM cart_items 
    WHERE session_id = ? OR (user_id = ? AND ? IS NOT NULL)
  `).run(sessionId, userId, userId);
  
  res.json({ ok: true, message: 'Carrito vaciado' });
}));

// Eliminar item específico del carrito
router.delete('/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sessionId = getSessionId(req);
  const userId = req.user?.id || null;
  
  const result = db.prepare(`
    DELETE FROM cart_items 
    WHERE product_id = ? AND (session_id = ? OR (user_id = ? AND ? IS NOT NULL))
  `).run(productId, sessionId, userId, userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item no encontrado en el carrito' });
  }
  
  res.json({ ok: true, message: 'Item eliminado del carrito' });
}));

module.exports = router;
