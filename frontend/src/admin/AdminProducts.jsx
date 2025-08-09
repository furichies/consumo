import React, { useState, useEffect } from 'react'
import { getProducts, getProviders, createProduct, updateProduct, deleteProduct } from '../api'

export default function AdminProducts() {
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', category: 'verdura', price_cents: 0, stock: 0, supplier_id: '', image_url: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setError(null)
      const [suppliersData, productsData] = await Promise.all([
        getProviders(),
        getProducts()
      ])
      setSuppliers(suppliersData)
      setProducts(productsData)
    } catch (err) {
      setError('Error cargando datos: ' + err.message)
    }
  }

  async function create() {
    if (!form.name || !form.supplier_id || form.price_cents <= 0) {
      alert('Por favor complete todos los campos requeridos')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createProduct({
        ...form,
        supplier_id: parseInt(form.supplier_id),
        price_cents: parseInt(form.price_cents),
        stock: parseInt(form.stock)
      })
      setForm({ name: '', category: 'verdura', price_cents: 0, stock: 0, supplier_id: '', image_url: '' })
      await loadData()
      alert('Producto creado exitosamente')
    } catch (err) {
      setError('Error creando producto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(p) { 
    setEditing({ ...p }) 
  }
  
  async function saveEdit() {
    if (!editing.name || !editing.supplier_id || editing.price_cents <= 0) {
      alert('Por favor complete todos los campos requeridos')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await updateProduct(editing.id, {
        ...editing,
        supplier_id: parseInt(editing.supplier_id),
        price_cents: parseInt(editing.price_cents),
        stock: parseInt(editing.stock)
      })
      setEditing(null)
      await loadData()
      alert('Producto actualizado exitosamente')
    } catch (err) {
      setError('Error actualizando producto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  async function remove(id) {
    if (!confirm('¿Borrar producto?')) return

    try {
      setLoading(true)
      setError(null)
      await deleteProduct(id)
      await loadData()
      alert('Producto eliminado exitosamente')
    } catch (err) {
      setError('Error eliminando producto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (<div className='p-4 border rounded'>
    <h3 className='font-semibold'>Productos</h3>
    
    {error && <div className='mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded'>{error}</div>}
    
    <div className='mt-2 space-y-2'>
      <input className='w-full p-2 border rounded' placeholder='Nombre' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <select className='w-full p-2 border rounded' value={form.supplier_id} onChange={e=>setForm({...form,supplier_id: parseInt(e.target.value)})}>
        <option value=''>Elige proveedor</option>
        {suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <input className='w-full p-2 border rounded' placeholder='Precio (cents)' value={form.price_cents} onChange={e=>setForm({...form,price_cents:parseInt(e.target.value)})} />
      <input className='w-full p-2 border rounded' placeholder='Stock' value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value)})} />
      <input className='w-full p-2 border rounded' placeholder='Imagen URL' value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
      <button className='mt-2 px-3 py-1 brand-btn rounded' onClick={create}>Crear producto</button>
    </div>

    <ul className='mt-4 space-y-2'>
      {products.map(p=> (
        <li key={p.id} className='p-2 border rounded flex justify-between items-center'>
          <div>
            <div className='font-semibold'>{p.name} — {(p.price_cents/100).toFixed(2)} €</div>
            <div className='text-sm text-gray-600'>{p.category} — {p.supplier_name}</div>
          </div>
          <div className='flex gap-2'>
            <button className='px-2 py-1 border rounded' onClick={()=>startEdit(p)}>Editar</button>
            <button className='px-2 py-1 border rounded text-red-600' onClick={()=>remove(p.id)}>Borrar</button>
          </div>
        </li>
      ))}
    </ul>

    {editing && (
      <div className='mt-4 p-3 border rounded bg-gray-50'>
        <h4 className='font-semibold'>Editar producto</h4>
        <input className='w-full p-2 border rounded mt-2' value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} />
        <input className='w-full p-2 border rounded mt-2' value={editing.category} onChange={e=>setEditing({...editing, category: e.target.value})} />
        <input className='w-full p-2 border rounded mt-2' value={editing.price_cents} onChange={e=>setEditing({...editing, price_cents: parseInt(e.target.value)})} />
        <input className='w-full p-2 border rounded mt-2' value={editing.stock} onChange={e=>setEditing({...editing, stock: parseInt(e.target.value)})} />
        <input className='w-full p-2 border rounded mt-2' value={editing.image_url} onChange={e=>setEditing({...editing, image_url: e.target.value})} />
        <div className='mt-2 flex gap-2'>
          <button className='px-3 py-1 brand-btn rounded' onClick={saveEdit}>Guardar</button>
          <button className='px-3 py-1 border rounded' onClick={()=>setEditing(null)}>Cancelar</button>
        </div>
      </div>
    )}
  </div>)
}
