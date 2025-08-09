import React, { useState } from 'react'

export default function ProductCard({ product, onAdd, isLoading = false }) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  
  const handleAdd = async () => {
    setIsAdding(true)
    try {
      await onAdd(product, quantity)
    } finally {
      setIsAdding(false)
      setQuantity(1)
    }
  }
  
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock <= 5 && product.stock > 0
  
  return (
    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group'>
      {/* Imagen del producto */}
      <div className='relative overflow-hidden'>
        <img 
          src={`http://localhost:5000${product.image_url}`} 
          alt={product.name} 
          className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
        />
        
        {/* Badge de categoria */}
        <div className='absolute top-3 left-3'>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            getCategoryColor(product.category)
          }`}>
            {getCategoryName(product.category)}
          </span>
        </div>
        
        {/* Badge de stock */}
        {isOutOfStock ? (
          <div className='absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            Sin Stock
          </div>
        ) : isLowStock ? (
          <div className='absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            Pocos Disponibles
          </div>
        ) : null}
      </div>
      
      {/* Información del producto */}
      <div className='p-4'>
        <div className='mb-2'>
          <h3 className='font-bold text-lg text-gray-800 mb-1 line-clamp-2'>{product.name}</h3>
          <p className='text-sm text-gray-500 flex items-center'>
            <span className='mr-1'>🏪</span>
            {product.supplier_name}
          </p>
        </div>
        
        {/* Precio */}
        <div className='mb-4'>
          <div className='text-2xl font-bold text-green-600'>
            {(product.price_cents/100).toFixed(2)} €
          </div>
          <div className='text-sm text-gray-500'>
            Stock: <span className={isLowStock ? 'text-orange-500 font-medium' : 'text-gray-700'}>
              {product.stock} unidades
            </span>
          </div>
        </div>
        
        {/* Controles de cantidad y compra */}
        <div className='space-y-3'>
          {!isOutOfStock && (
            <div className='flex items-center space-x-2'>
              <label className='text-sm text-gray-600 font-medium'>Cantidad:</label>
              <div className='flex items-center border rounded-lg'>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='px-2 py-1 hover:bg-gray-100 transition-colors'
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type='number' 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className='w-16 text-center py-1 border-0 focus:ring-0'
                  min='1'
                  max={product.stock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className='px-2 py-1 hover:bg-gray-100 transition-colors'
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isOutOfStock 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isAdding ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                <span>Añadiendo...</span>
              </>
            ) : isOutOfStock ? (
              <span>No Disponible</span>
            ) : (
              <>
                <span>🛒</span>
                <span>Añadir al Carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Función para obtener el color de la categoría
function getCategoryColor(category) {
  const colors = {
    verdura: 'bg-green-100 text-green-800',
    lacteo: 'bg-blue-100 text-blue-800',
    carne: 'bg-red-100 text-red-800',
    panaderia: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  }
  return colors[category] || colors.default
}

// Función para obtener el nombre de la categoría en español
function getCategoryName(category) {
  const names = {
    verdura: 'Verduras',
    lacteo: 'Lácteos',
    carne: 'Carnes', 
    panaderia: 'Panadería'
  }
  return names[category] || category
}
