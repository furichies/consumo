import React from 'react'
export default function ProductCard({ product, onAdd }){
  return (
    <div className='bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col'>
      <img src={product.image_url} alt={product.name} className='w-full h-40 object-cover' />
      <div className='p-3 flex-1 flex flex-col'>
        <h3 className='font-semibold text-lg'>{product.name}</h3>
        <div className='text-sm text-gray-600'>{product.supplier_name}</div>
        <div className='mt-2 text-xl font-bold'>{(product.price_cents/100).toFixed(2)} €</div>
        <div className='mt-3 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>Stock: {product.stock}</div>
          <button className='px-3 py-1 rounded brand-btn' onClick={()=>onAdd(product)} disabled={product.stock<=0}>Añadir</button>
        </div>
      </div>
    </div>
  )
}
