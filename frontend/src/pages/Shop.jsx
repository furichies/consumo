import React, { useState } from 'react'
import { getProducts, postCart } from '../api'
import ProductCard from '../components/ProductCard'

export default function Shop({ onCartUpdate }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedCategory, searchTerm, sortBy])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('No se pudo conectar con la API')
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortProducts() {
    let filtered = products
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price_cents - b.price_cents
        case 'price-desc':
          return b.price_cents - a.price_cents
        case 'stock':
          return b.stock - a.stock
        default: // name
          return a.name.localeCompare(b.name)
      }
    })
    
    setFilteredProducts(filtered)
  }

  async function handleAddToCart(product, quantity = 1) {
    try {
      await postCart({ productId: product.id, qty: quantity })
      
      // Mostrar notificación de éxito
      showNotification(`¡${product.name} añadido al carrito!`, 'success')
      
      // Actualizar contador del carrito si está disponible
      if (onCartUpdate) {
        onCartUpdate()
      }
    } catch (err) {
      showNotification('Error al añadir al carrito', 'error')
    }
  }

  function showNotification(message, type) {
    // Implementación simple de notificación
    const notification = document.createElement('div')
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-medium`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Obtener categorías únicas
  const categories = ['all', ...new Set(products.map(p => p.category))]
  const categoryNames = {
    all: 'Todas las Categorías',
    verdura: 'Verduras',
    lacteo: 'Lácteos', 
    carne: 'Carnes',
    panaderia: 'Panadería'
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-red-600 text-xl mb-4'>⚠️ {error}</div>
        <button 
          onClick={fetchData}
          className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium'
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Banner Hero */}
      <div className='relative bg-gradient-to-r from-green-600 to-green-700 rounded-2xl overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='relative px-8 py-12 text-center text-white'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Consumo Local</h1>
          <p className='text-xl md:text-2xl mb-6 opacity-90'>
            Productos frescos y locales para tu comunidad
          </p>
          <p className='text-lg opacity-80 max-w-2xl mx-auto'>
            Apoyamos a los productores locales y ofrecemos los mejores productos
            frescos directamente a tu mesa
          </p>
        </div>
      </div>

      {/* Controles de filtrado y búsqueda */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Búsqueda */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              🔍 Buscar productos
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Nombre del producto o proveedor...'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
            />
          </div>
          
          {/* Filtro de categoría */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              📂 Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryNames[cat] || cat}
                </option>
              ))}
            </select>
          </div>
          
          {/* Ordenar por */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              🔄 Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
            >
              <option value='name'>Nombre</option>
              <option value='price-asc'>Precio (menor a mayor)</option>
              <option value='price-desc'>Precio (mayor a menor)</option>
              <option value='stock'>Stock disponible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {selectedCategory === 'all' ? 'Todos los Productos' : categoryNames[selectedCategory]}
          </h2>
          <div className='text-gray-600'>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='bg-gray-200 animate-pulse rounded-xl h-80'></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No se encontraron productos
            </h3>
            <p className='text-gray-500 mb-4'>
              Intenta cambiar los filtros o el término de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium'
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
