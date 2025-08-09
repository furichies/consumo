const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { globalErrorHandler } = require('./middleware/errorHandler');
const auth = require('./routes/auth');
const users = require('./routes/users');
const suppliers = require('./routes/suppliers');
const products = require('./routes/products');
const cart = require('./routes/cart');
const orders = require('./routes/orders');

const app = express();

// Middleware de seguridad y configuración
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/suppliers', suppliers);
app.use('/api/products', products);
app.use('/api/cart', cart);
app.use('/api/orders', orders);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Middleware global de manejo de errores (debe ir al final)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('API listening on', PORT));
