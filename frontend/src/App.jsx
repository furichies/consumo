import React from 'react'
import Header from './components/Header'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App(){
  const [route,setRoute] = React.useState('shop')
  const [user,setUser] = React.useState(null)
  return (
    <div className='min-h-screen bg-white'>
      <Header onNavigate={setRoute} user={user} onLogout={()=>setUser(null)} />
      <div className='app-container px-4 py-6'>
        {route==='shop' && <Shop />}
        {route==='cart' && <Cart />}
        {route==='login' && <Login onLogin={u=>setUser(u)} />}
        {route==='admin' && <Admin user={user} />}
      </div>
    </div>
  )
}
