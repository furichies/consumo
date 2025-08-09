const API = (import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://localhost:5000/api'
export async function login(email,password){ return fetch(`${API}/auth/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})}).then(r=>r.json()) }
export async function register(name,email,password){ return fetch(`${API}/auth/register`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,email,password})}).then(r=>r.json()) }
export async function getProducts(){ return fetch(`${API}/products`).then(r=>r.json()) }
export async function getProviders(){ return fetch(`${API}/suppliers`).then(r=>r.json()) }
export async function postCart(item){ return fetch(`${API}/cart`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(item)}).then(r=>r.json()) }
export async function getCart(){ return fetch(`${API}/cart`).then(r=>r.json()) }
export async function checkout(items,userId,opts){
  const body = { items, userId, ...(opts||{}) }
  return fetch(`${API}/orders/checkout`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json())
}
export async function executePaypal(payload){ return fetch(`${API}/orders/execute-paypal`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}).then(r=>r.json()) }
