import React,{useState,useEffect} from 'react'
import { getProviders } from '../api'
export default function AdminSuppliers(){
  const [providers,setProviders]=useState([])
  const [name,setName]=useState('')
  const [contact,setContact]=useState('')
  const [editing, setEditing] = useState(null)
  useEffect(()=>{ async function f(){ setProviders(await getProviders()) } f() },[])
  async function add(){
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/suppliers',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name, contact }) });
    setName(''); setContact(''); setProviders(await getProviders())
  }
  async function remove(id){
    if(!confirm('¿Borrar proveedor?')) return;
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/suppliers/' + id, { method: 'DELETE' });
    setProviders(await getProviders())
  }
  function startEdit(p){
    setEditing({ ...p });
  }
  async function saveEdit(){
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:5000/api') + '/suppliers/' + editing.id, { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({ name: editing.name, contact: editing.contact })});
    setEditing(null);
    setProviders(await getProviders());
  }
  return (<div className='p-4 border rounded'>
    <h3 className='font-semibold'>Proveedores</h3>
    <div className='mt-2 space-y-2'>
      <input className='w-full p-2 border rounded' placeholder='Nombre' value={name} onChange={e=>setName(e.target.value)} />
      <input className='w-full p-2 border rounded' placeholder='Contacto' value={contact} onChange={e=>setContact(e.target.value)} />
      <button className='mt-2 px-3 py-1 brand-btn rounded' onClick={add}>Crear proveedor</button>
    </div>

    <ul className='mt-4 space-y-2'>
      {providers.map(p=> (
        <li key={p.id} className='p-2 border rounded flex items-center justify-between'>
          <div>
            <div className='font-semibold'>{p.name}</div>
            <div className='text-sm text-gray-600'>{p.contact}</div>
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
        <h4 className='font-semibold'>Editar proveedor</h4>
        <input className='w-full p-2 border rounded mt-2' value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} />
        <input className='w-full p-2 border rounded mt-2' value={editing.contact} onChange={e=>setEditing({...editing, contact: e.target.value})} />
        <div className='mt-2 flex gap-2'>
          <button className='px-3 py-1 brand-btn rounded' onClick={saveEdit}>Guardar</button>
          <button className='px-3 py-1 border rounded' onClick={()=>setEditing(null)}>Cancelar</button>
        </div>
      </div>
    )}
  </div>)
}
