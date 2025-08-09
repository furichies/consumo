import React,{useState,useEffect} from 'react'
import { getProducts, getProviders } from '../api'
export default function AdminProducts(){
  const [suppliers,setSuppliers]=useState([])
  const [products,setProducts]=useState([])
  const [form,setForm]=useState({ name:'', category:'verdura', price_cents:0, stock:0, supplier_id:'', image_url:'' })
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ async function f(){ setSuppliers(await getProviders()); setProducts(await getProducts()); } f() },[])

  async function create(){ await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/products', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form) }); setForm({ name:'', category:'verdura', price_cents:0, stock:0, supplier_id:'', image_url:'' }); setProducts(await getProducts()) }

  function startEdit(p){ setEditing({ ...p }) }
  async function saveEdit(){
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/products/' + editing.id, { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(editing) });
    setEditing(null);
    setProducts(await getProducts());
  }
  async function remove(id){
    if(!confirm('¿Borrar producto?')) return;
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/products/' + id, { method: 'DELETE' });
    setProducts(await getProducts());
  }

  return (<div className='p-4 border rounded'>
    <h3 className='font-semibold'>Productos</h3>
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
