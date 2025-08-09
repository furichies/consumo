import React, { useState } from 'react'

export default function Header({ onNavigate, user, onLogout, cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const handleNavClick = (page) => {
    onNavigate(page)
    setIsMenuOpen(false)
  }

  return (
    <header className='bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50'>
      <div className='app-container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo y Título */}
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center'>
                <span className='text-green-600 font-bold text-xl'>C</span>
              </div>
              <div>
                <h1 className='text-xl font-bold'>Consumo Local</h1>
                <p className='text-green-100 text-xs hidden sm:block'>Agrupación de Compras</p>
              </div>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className='hidden md:flex items-center space-x-1'>
            <NavButton 
              onClick={() => handleNavClick('shop')} 
              icon='🛍️'
              text='Tienda'
            />
            <NavButton 
              onClick={() => handleNavClick('cart')} 
              icon='🛒'
              text={`Carrito ${cartCount > 0 ? `(${cartCount})` : ''}`}
              badge={cartCount}
            />
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavButton 
                    onClick={() => handleNavClick('admin')} 
                    icon='⚙️'
                    text='Admin'
                  />
                )}
                <div className='flex items-center space-x-3 ml-4 pl-4 border-l border-green-400'>
                  <div className='text-sm'>
                    <div className='font-medium'>Hola, {user.name}</div>
                    <div className='text-green-200 text-xs'>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors'
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <NavButton 
                onClick={() => handleNavClick('login')} 
                icon='👤'
                text='Iniciar Sesión'
              />
            )}
          </nav>

          {/* Botón menú móvil */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-green-600 transition-colors'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-green-500 py-4'>
            <div className='space-y-2'>
              <MobileNavButton onClick={() => handleNavClick('shop')} icon='🛍️' text='Tienda' />
              <MobileNavButton 
                onClick={() => handleNavClick('cart')} 
                icon='🛒' 
                text={`Carrito ${cartCount > 0 ? `(${cartCount})` : ''}`} 
              />
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <MobileNavButton onClick={() => handleNavClick('admin')} icon='⚙️' text='Admin' />
                  )}
                  <div className='px-4 py-3 bg-green-600 rounded-lg mt-4'>
                    <div className='text-sm font-medium'>Hola, {user.name}</div>
                    <div className='text-green-200 text-xs mb-2'>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
                    <button 
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium w-full transition-colors'
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <MobileNavButton onClick={() => handleNavClick('login')} icon='👤' text='Iniciar Sesión' />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// Componente para botones de navegación desktop
function NavButton({ onClick, icon, text, badge }) {
  return (
    <button
      onClick={onClick}
      className='relative flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm'
    >
      <span>{icon}</span>
      <span>{text}</span>
      {badge > 0 && (
        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {badge}
        </span>
      )}
    </button>
  )
}

// Componente para botones de navegación móvil
function MobileNavButton({ onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium'
    >
      <span className='text-lg'>{icon}</span>
      <span>{text}</span>
    </button>
  )
}
