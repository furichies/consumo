const { body, param } = require('express-validator');

// Validadores para autenticación
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('La contraseña debe tener entre 6 y 100 caracteres')
];

// Validadores para productos
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre del producto debe tener entre 2 y 200 caracteres'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  body('price_cents')
    .isInt({ min: 1 })
    .withMessage('El precio debe ser un número entero mayor a 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('supplier_id')
    .isInt({ min: 1 })
    .withMessage('Debe especificar un proveedor válido'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('La URL de imagen debe ser válida')
];

const validateProductUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  ...validateProduct
];

// Validadores para proveedores
const validateSupplier = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre del proveedor debe tener entre 2 y 200 caracteres'),
  body('contact')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La información de contacto debe tener entre 5 y 200 caracteres')
];

const validateSupplierUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de proveedor inválido'),
  ...validateSupplier
];

// Validadores para carrito
const validateCartItem = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  body('qty')
    .isInt({ min: 1, max: 999 })
    .withMessage('La cantidad debe ser un número entre 1 y 999')
];

// Validadores para checkout
const validateCheckout = [
  body('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  body('items.*.productId')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  body('items.*.qty')
    .isInt({ min: 1, max: 999 })
    .withMessage('Cantidad inválida'),
  body('payment_method')
    .isIn(['wallet', 'paypal'])
    .withMessage('Método de pago debe ser wallet o paypal'),
  body('wallet_email')
    .if(body('payment_method').equals('wallet'))
    .isEmail()
    .normalizeEmail()
    .withMessage('Email del wallet requerido para pago con wallet')
];

// Validador para parámetros ID
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido')
];

module.exports = {
  validateLogin,
  validateRegister,
  validateProduct,
  validateProductUpdate,
  validateSupplier,
  validateSupplierUpdate,
  validateCartItem,
  validateCheckout,
  validateId
};
