const API = (import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://localhost:5000/api'

// Función helper para obtener headers con autenticación
function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'content-type': 'application/json',
    ...(token && { 'authorization': `Bearer ${token}` })
  }
}

// Función helper para manejar respuestas
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  
  if (response.status === 401) {
    localStorage.removeItem('token')
    throw new Error('Sesión expirada')
  }
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición')
  }
  
  return data
}

// Autenticación
export async function login(email, password) {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return handleResponse(response)
}

export async function register(name, email, password) {
  const response = await fetch(`${API}/auth/register`, {
    method: 'POST', 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  return handleResponse(response)
}

export async function getCurrentUser() {
  const response = await fetch(`${API}/users/me`, {
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}

// Productos
export async function getProducts() {
  const response = await fetch(`${API}/products`)
  return handleResponse(response)
}

// Proveedores
export async function getProviders() {
  const response = await fetch(`${API}/suppliers`)
  return handleResponse(response)
}

// Carrito
export async function postCart(item) {
  const response = await fetch(`${API}/cart`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item)
  })
  return handleResponse(response)
}

export async function getCart() {
  const response = await fetch(`${API}/cart`, {
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}

export async function clearCart() {
  const response = await fetch(`${API}/cart/clear`, {
    method: 'POST',
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}

// Órdenes
export async function checkout(items, userId, opts) {
  const body = { items, userId, ...(opts || {}) }
  const response = await fetch(`${API}/orders/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  })
  return handleResponse(response)
}

export async function executePaypal(payload) {
  const response = await fetch(`${API}/orders/execute-paypal`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })
  return handleResponse(response)
}

export async function getOrders() {
  const response = await fetch(`${API}/orders`, {
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}

// Admin - Productos
export async function createProduct(productData) {
  const response = await fetch(`${API}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  })
  return handleResponse(response)
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  })
  return handleResponse(response)
}

export async function deleteProduct(id) {
  const response = await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}

// Admin - Proveedores
export async function createSupplier(supplierData) {
  const response = await fetch(`${API}/suppliers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(supplierData)
  })
  return handleResponse(response)
}

export async function updateSupplier(id, supplierData) {
  const response = await fetch(`${API}/suppliers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(supplierData)
  })
  return handleResponse(response)
}

export async function deleteSupplier(id) {
  const response = await fetch(`${API}/suppliers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  return handleResponse(response)
}
