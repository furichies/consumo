const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Obtener información del usuario actual
router.get('/me', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = db.prepare(
      'SELECT id, name, email, role FROM users WHERE id = ?'
    ).get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  })
);

module.exports = router;
