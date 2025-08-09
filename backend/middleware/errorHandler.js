const { validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación de express-validator
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  
  next();
}

/**
 * Middleware global de manejo de errores
 */
function globalErrorHandler(error, req, res, next) {
  console.error('Error interno:', error);

  // Error de base de datos
  if (error.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Error de restricción en base de datos',
      detail: 'Es posible que el recurso ya exista o falten datos requeridos'
    });
  }

  // Error de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'JSON malformado',
      detail: 'Verifique el formato de los datos enviados'
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    error: 'Error interno del servidor',
    detail: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
  });
}

/**
 * Middleware para envolver funciones async y capturar errores
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  handleValidationErrors,
  globalErrorHandler,
  asyncHandler
};
