import React from 'react'
import Header from './components/Header'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { getCurrentUser } from './api'

export default function App(){
  const [route, setRoute] = React.useState('shop')
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  
  // Cargar usuario al iniciar la aplicación
  React.useEffect(() => {
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
    
    loadUser()
  }, [])
  
  const handleLogin = (userData) => {
    setUser(userData)
    setRoute('shop') // Redirigir a tienda después del login
  }
  
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    setRoute('shop')
  }
  
  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div>Cargando...</div>
      </div>
    )
  }
  
  return (
    <div className='min-h-screen bg-white'>
      <Header onNavigate={setRoute} user={user} onLogout={handleLogout} />
      <div className='app-container px-4 py-6'>
        {route==='shop' && <Shop />}
        {route==='cart' && <Cart />}
        {route==='login' && <Login onLogin={handleLogin} />}
        {route==='admin' && <Admin user={user} />}
      </div>
    </div>
  )
}
