import React from 'react'
import { getCart, checkout } from '../api'

export default function Cart(){
  const [items, setItems] = React.useState([])
  const [error, setError] = React.useState(null)

  React.useEffect(()=>{
    async function load(){
      try{
        setItems(await getCart())
      }catch(e){ setError('No se pudo cargar el carrito') }
    }
    load()
  },[])

  async function payWithWallet(){
    if(!items.length) return alert('Carrito vacío')
    const email = prompt('Introduce email del wallet (ej: user@example.com)')
    if(!email) return
    const simple = items.map(i=>({ productId: i.productId, qty: i.qty }))
    const res = await checkout(simple, null, { payment_method: 'wallet', wallet_email: email })
    if(res.ok) alert('Pago con wallet OK — Pedido #' + res.orderId)
    else alert('Error: ' + JSON.stringify(res))
  }

  async function payWithPayPal(){
    if(!items.length) return alert('Carrito vacío')
    const simple = items.map(i=>({ productId: i.productId, qty: i.qty }))
    const res = await checkout(simple, null, { payment_method: 'paypal', paypal: { return_url: 'http://localhost:5173', cancel_url: 'http://localhost:5173' } })
    if(res && res.payment && res.payment.approval_url){
      window.open(res.payment.approval_url, '_blank')
      alert('Abre la ventana de pago simulado y confirma. Después ejecuta /api/orders/execute-paypal desde backend si quieres automatizar.')
    } else alert('Error iniciando PayPal simulado')
  }

  if (error) return <div className='text-red-600'>{error}</div>

  return (
    <div>
      <h1 className='text-2xl font-bold'>Carrito</h1>
      <div className='mt-4 space-y-3'>
        {items.length===0 && <div>El carrito está vacío.</div>}
        {items.map(it=> (
          <div key={it.productId} className='p-3 border rounded flex items-center gap-4'>
            <img src={it.product.image_url} alt='' className='w-24 h-20 object-cover rounded' />
            <div className='flex-1'>
              <div className='font-semibold'>{it.product.name}</div>
              <div className='text-sm text-gray-500'>{(it.product.price_cents/100).toFixed(2)} € — Cantidad: {it.qty}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 flex gap-3'>
        <button className='px-4 py-2 brand-btn rounded' onClick={payWithWallet}>Pagar con Wallet</button>
        <button className='px-4 py-2 brand-btn rounded' onClick={payWithPayPal}>Pagar con PayPal (simulado)</button>
      </div>
    </div>
  )
}
