import React from 'react'
import AdminSuppliers from '../admin/AdminSuppliers'
import AdminProducts from '../admin/AdminProducts'
export default function Admin({ user }){
  if(!user || user.role !== 'admin') return <div>Acceso restringido. Inicia sesión como admin.</div>
  return (
    <div>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4'>
        <AdminSuppliers />
        <AdminProducts />
      </div>
    </div>
  )
}
