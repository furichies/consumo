import React from 'react'
import { getProducts, postCart } from '../api'
import ProductCard from '../components/ProductCard'

export default function Shop(){
  const [products, setProducts] = React.useState([])
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    async function fetchData(){
      try{
        const data = await getProducts()
        setProducts(data)
      }catch(err){
        console.error(err)
        setError('No se pudo conectar con la API')
      }
    }
    fetchData()
  }, [])

  async function add(p){
    await postCart({ productId: p.id, qty: 1 })
    alert('Añadido al carrito: ' + p.name)
  }

  if (error) return <div className='text-red-600'>{error}</div>

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Tienda</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
        {products.map(p=> <ProductCard key={p.id} product={p} onAdd={add} />)}
      </div>
    </div>
  )
}
