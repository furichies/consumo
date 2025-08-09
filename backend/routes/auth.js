const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateLogin, validateRegister } = require('../validators');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Login endpoint
router.post('/login', 
  validateLogin,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respuesta exitosa
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  })
);

// Register endpoint
router.post('/register',
  validateRegister,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    // Hash de la contraseña
    const hashPassword = bcrypt.hashSync(password, 10);
    
    try {
      // Crear usuario
      const info = db.prepare(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
      ).run(name, email, hashPassword, 'user');
      
      // Obtener usuario creado
      const newUser = db.prepare(
        'SELECT id, name, email, role FROM users WHERE id = ?'
      ).get(info.lastInsertRowid);
      
      res.status(201).json(newUser);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      throw error; // Re-lanzar para que lo maneje el middleware global
    }
  })
);

module.exports = router;
