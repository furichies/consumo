const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct, validateProductUpdate, validateId } = require('../validators');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

// Obtener todos los productos (público)
router.get('/', asyncHandler(async (req, res) => {
  const products = db.prepare(`
    SELECT p.*, s.name as supplier_name 
    FROM products p 
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.name ASC
  `).all();
  
  res.json(products);
}));

// Crear producto (solo admin)
router.post('/',
  authenticateToken,
  requireAdmin,
  validateProduct,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, category, price_cents, stock, supplier_id, image_url } = req.body;
    
    // Verificar que el proveedor existe
    const supplier = db.prepare('SELECT id FROM suppliers WHERE id = ?').get(supplier_id);
    if (!supplier) {
      return res.status(400).json({ error: 'Proveedor no encontrado' });
    }
    
    // Crear producto
    const info = db.prepare(`
      INSERT INTO products (name, category, price_cents, stock, supplier_id, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, category, price_cents, stock, supplier_id, image_url || null);
    
    // Obtener producto creado con información del proveedor
    const newProduct = db.prepare(`
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.id = ?
    `).get(info.lastInsertRowid);
    
    res.status(201).json(newProduct);
  })
);

// Actualizar producto (solo admin)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateProductUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, price_cents, stock, supplier_id, image_url } = req.body;
    
    // Verificar que el producto existe
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar que el proveedor existe
    const supplier = db.prepare('SELECT id FROM suppliers WHERE id = ?').get(supplier_id);
    if (!supplier) {
      return res.status(400).json({ error: 'Proveedor no encontrado' });
    }
    
    // Actualizar producto
    db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, price_cents = ?, stock = ?, supplier_id = ?, image_url = ?
      WHERE id = ?
    `).run(name, category, price_cents, stock, supplier_id, image_url || null, id);
    
    // Obtener producto actualizado
    const updatedProduct = db.prepare(`
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.id = ?
    `).get(id);
    
    res.json(updatedProduct);
  })
);

// Eliminar producto (solo admin)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Verificar que el producto existe
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar si hay órdenes que dependen de este producto
    const orderItems = db.prepare('SELECT id FROM order_items WHERE product_id = ? LIMIT 1').get(id);
    if (orderItems) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el producto porque tiene órdenes asociadas' 
      });
    }
    
    // Eliminar producto
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    
    res.json({ deleted: true, id: parseInt(id) });
  })
);

module.exports = router;
