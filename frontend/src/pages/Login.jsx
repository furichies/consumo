import React from 'react'
import { login, register } from '../api'

export default function Login({ onLogin }){
  const [mode, setMode] = React.useState('login')
  const [email, setEmail] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [name, setName] = React.useState('')

  async function submit(e){
    e.preventDefault()
    if(mode==='login'){
      const res = await login(email, pass)
      if(res.token){ localStorage.setItem('token', res.token); onLogin(res.user); alert('Login OK') }
      else alert('Credenciales inválidas')
    } else {
      const res = await register(name, email, pass)
      if(res && res.id) alert('Registrado OK')
      else alert('Error en registro')
    }
  }

  return (
    <div className='max-w-md'>
      <h1 className='text-2xl font-bold'>{mode==='login'?'Login':'Registro'}</h1>
      <form onSubmit={submit} className='mt-4 space-y-3'>
        {mode==='register' && <input className='w-full p-2 border rounded' placeholder='Nombre' value={name} onChange={e=>setName(e.target.value)} />}
        <input className='w-full p-2 border rounded' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input type='password' className='w-full p-2 border rounded' placeholder='Contraseña' value={pass} onChange={e=>setPass(e.target.value)} />
        <div>
          <button className='px-4 py-2 brand-btn rounded' type='submit'>{mode==='login'?'Entrar':'Registrarse'}</button>
        </div>
      </form>
      <div className='mt-3'>
        <button className='underline' onClick={()=>setMode(mode==='login'?'register':'login')}>Cambiar a {mode==='login'?'registro':'login'}</button>
      </div>
    </div>
  )
}
