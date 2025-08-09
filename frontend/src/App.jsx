import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { getCurrentUser, getCart } from './api'

export default function App() {
  const [route, setRoute] = useState('shop')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  
  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    loadUser()
    updateCartCount() // Cargar contador inicial del carrito
  }, [])
  
  async function loadUser() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.log('Token inválido o expirado')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }
  
  // Función para actualizar el contador del carrito
  async function updateCartCount() {
    try {
      const cartItems = await getCart()
      const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0)
      setCartCount(totalItems)
    } catch (error) {
      // Si hay error, mantener el contador en 0
      setCartCount(0)
    }
  }
  
  const handleLogin = (userData) => {
    setUser(userData)
    setRoute('shop') // Redirigir a tienda después del login
    updateCartCount() // Actualizar carrito después del login
  }
  
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    setRoute('shop')
    setCartCount(0) // Limpiar contador del carrito
  }
  
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4'></div>
          <div className='text-green-800 text-lg font-medium'>Cargando Consumo Local...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100'>
      <Header 
        onNavigate={setRoute} 
        user={user} 
        onLogout={handleLogout}
        cartCount={cartCount}
      />
      
      <main className='app-container mx-auto px-4 py-6 max-w-7xl'>
        {route === 'shop' && (
          <Shop onCartUpdate={updateCartCount} />
        )}
        {route === 'cart' && (
          <Cart onCartUpdate={updateCartCount} />
        )}
        {route === 'login' && (
          <Login onLogin={handleLogin} />
        )}
        {route === 'admin' && (
          <Admin user={user} />
        )}
      </main>
      
      {/* Footer */}
      <footer className='bg-green-800 text-white py-8 mt-12'>
        <div className='app-container mx-auto px-4 max-w-7xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-lg font-bold mb-4'>Consumo Local</h3>
              <p className='text-green-200 text-sm'>
                Conectamos productores locales con consumidores responsables
                para crear una comunidad más sostenible.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-bold mb-4'>Enlaces Rápidos</h3>
              <ul className='space-y-2 text-sm text-green-200'>
                <li><button onClick={() => setRoute('shop')} className='hover:text-white'>Tienda</button></li>
                <li><button onClick={() => setRoute('cart')} className='hover:text-white'>Mi Carrito</button></li>
                {!user && <li><button onClick={() => setRoute('login')} className='hover:text-white'>Iniciar Sesión</button></li>}
                {user?.role === 'admin' && <li><button onClick={() => setRoute('admin')} className='hover:text-white'>Administración</button></li>}
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-bold mb-4'>Contacto</h3>
              <div className='text-sm text-green-200 space-y-1'>
                <p>📧 info@consumolocal.com</p>
                <p>📱 +34 600 123 456</p>
                <p>📍 Tu Ciudad, España</p>
              </div>
            </div>
          </div>
          <div className='border-t border-green-700 mt-8 pt-6 text-center text-green-300 text-sm'>
            <p>© 2024 Consumo Local. Desarrollado con ❤️ para la comunidad.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
