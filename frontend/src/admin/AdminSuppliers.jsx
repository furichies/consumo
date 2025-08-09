import React, { useState, useEffect } from 'react'
import { getProviders, createSupplier, updateSupplier, deleteSupplier } from '../api'

export default function AdminSuppliers() {
  const [providers, setProviders] = useState([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadProviders()
  }, [])
  
  async function loadProviders() {
    try {
      setError(null)
      const data = await getProviders()
      setProviders(data)
    } catch (err) {
      setError('Error cargando proveedores: ' + err.message)
    }
  }
  
  async function add() {
    if (!name.trim() || !contact.trim()) {
      setError('Por favor completa todos los campos')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      await createSupplier({ name: name.trim(), contact: contact.trim() })
      setName('')
      setContact('')
      await loadProviders()
    } catch (err) {
      setError('Error creando proveedor: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  async function remove(id) {
    if (!confirm('¿Borrar proveedor?')) return
    
    try {
      setLoading(true)
      setError(null)
      await deleteSupplier(id)
      await loadProviders()
    } catch (err) {
      setError('Error eliminando proveedor: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  function startEdit(p) {
    setEditing({ ...p })
    setError(null)
  }
  
  async function saveEdit() {
    if (!editing.name.trim() || !editing.contact.trim()) {
      setError('Por favor completa todos los campos')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      await updateSupplier(editing.id, { 
        name: editing.name.trim(), 
        contact: editing.contact.trim() 
      })
      setEditing(null)
      await loadProviders()
    } catch (err) {
      setError('Error actualizando proveedor: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='p-6 border rounded-lg bg-white shadow-sm'>
      <h3 className='text-xl font-bold text-gray-800 mb-4'>Gestión de Proveedores</h3>
      
      {/* Mostrar errores */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
          {error}
        </div>
      )}
      
      {/* Formulario para crear proveedor */}
      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <h4 className='font-semibold text-gray-700 mb-3'>Crear Nuevo Proveedor</h4>
        <div className='space-y-3'>
          <input 
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500' 
            placeholder='Nombre del proveedor' 
            value={name} 
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <input 
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500' 
            placeholder='Información de contacto' 
            value={contact} 
            onChange={e => setContact(e.target.value)}
            disabled={loading}
          />
          <button 
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            onClick={add}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Proveedor'}
          </button>
        </div>
      </div>

      {/* Lista de proveedores */}
      <div>
        <h4 className='font-semibold text-gray-700 mb-3'>
          Proveedores Existentes ({providers.length})
        </h4>
        {providers.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <div className='text-4xl mb-2'>📦</div>
            <p>No hay proveedores registrados</p>
          </div>
        ) : (
          <ul className='space-y-3'>
            {providers.map(p => (
              <li key={p.id} className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='font-semibold text-gray-800'>{p.name}</div>
                    <div className='text-sm text-gray-600 mt-1'>📞 {p.contact}</div>
                  </div>
                  <div className='flex gap-2'>
                    <button 
                      className='px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                      onClick={() => startEdit(p)}
                      disabled={loading}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className='px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors'
                      onClick={() => remove(p.id)}
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de edición */}
      {editing && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4'>
            <h4 className='text-lg font-semibold text-gray-800 mb-4'>Editar Proveedor</h4>
            <div className='space-y-3'>
              <input 
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                placeholder='Nombre del proveedor'
                value={editing.name} 
                onChange={e => setEditing({...editing, name: e.target.value})}
                disabled={loading}
              />
              <input 
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                placeholder='Información de contacto'
                value={editing.contact} 
                onChange={e => setEditing({...editing, contact: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className='mt-6 flex gap-3'>
              <button 
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={saveEdit}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button 
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                onClick={() => setEditing(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
