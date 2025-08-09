import React from 'react'
export default function Header({ onNavigate, user, onLogout }){
  return (
    <header className='bg-brand text-white shadow-sm'>
      <div className='app-container flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded px-3 py-1 font-bold text-lg'>Consumo</div>
          <div className='text-sm opacity-90'>Agrupación local</div>
        </div>
        <nav className='flex items-center gap-3'>
          <button onClick={()=>onNavigate('shop')} className='px-3 py-1'>Tienda</button>
          <button onClick={()=>onNavigate('cart')} className='px-3 py-1'>Carrito</button>
          <button onClick={()=>onNavigate('login')} className='px-3 py-1'>Login</button>
          <button onClick={()=>onNavigate('admin')} className='px-3 py-1'>Admin</button>
          {user && <span className='ml-3'>Hola, {user.name} <button onClick={onLogout} className='ml-2 underline'>Salir</button></span>}
        </nav>
      </div>
    </header>
  )
}
