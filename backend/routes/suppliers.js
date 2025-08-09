const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateSupplier, validateSupplierUpdate, validateId } = require('../validators');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

// Obtener todos los proveedores (público para selects)
router.get('/', asyncHandler(async (req, res) => {
  const suppliers = db.prepare('SELECT * FROM suppliers ORDER BY name ASC').all();
  res.json(suppliers);
}));

// Crear proveedor (solo admin)
router.post('/',
  authenticateToken,
  requireAdmin,
  validateSupplier,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, contact } = req.body;
    
    // Verificar que no exista un proveedor con el mismo nombre
    const existingSupplier = db.prepare('SELECT id FROM suppliers WHERE LOWER(name) = LOWER(?)').get(name);
    if (existingSupplier) {
      return res.status(400).json({ error: 'Ya existe un proveedor con ese nombre' });
    }
    
    // Crear proveedor
    const info = db.prepare('INSERT INTO suppliers (name, contact) VALUES (?, ?)').run(name, contact);
    
    // Obtener proveedor creado
    const newSupplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(info.lastInsertRowid);
    
    res.status(201).json(newSupplier);
  })
);

// Actualizar proveedor (solo admin)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateSupplierUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, contact } = req.body;
    
    // Verificar que el proveedor existe
    const existingSupplier = db.prepare('SELECT id FROM suppliers WHERE id = ?').get(id);
    if (!existingSupplier) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    // Verificar que no hay conflicto de nombres (excepto consigo mismo)
    const nameConflict = db.prepare('SELECT id FROM suppliers WHERE LOWER(name) = LOWER(?) AND id != ?').get(name, id);
    if (nameConflict) {
      return res.status(400).json({ error: 'Ya existe otro proveedor con ese nombre' });
    }
    
    // Actualizar proveedor
    db.prepare('UPDATE suppliers SET name = ?, contact = ? WHERE id = ?').run(name, contact, id);
    
    // Obtener proveedor actualizado
    const updatedSupplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    
    res.json(updatedSupplier);
  })
);

// Eliminar proveedor (solo admin)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Verificar que el proveedor existe
    const existingSupplier = db.prepare('SELECT id FROM suppliers WHERE id = ?').get(id);
    if (!existingSupplier) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    // Verificar si tiene productos asociados
    const associatedProducts = db.prepare('SELECT id FROM products WHERE supplier_id = ? LIMIT 1').get(id);
    if (associatedProducts) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el proveedor porque tiene productos asociados' 
      });
    }
    
    // Eliminar proveedor
    db.prepare('DELETE FROM suppliers WHERE id = ?').run(id);
    
    res.json({ deleted: true, id: parseInt(id) });
  })
);

module.exports = router;
