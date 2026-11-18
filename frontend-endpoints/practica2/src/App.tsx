import { useEffect, useState } from 'react'
import Login from './components/Login'
import UserList from './components/UserList'
import type { LoginResult, UserDetail } from './types'

const TOKEN_KEY = 'token'

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setCurrentUser(null)
  }

  function handleLogin(result: LoginResult) {
    const accessToken = result.access_token ?? result.token
    if (!accessToken) {
      throw new Error('La respuesta del login no trae token')
    }
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)
    setCurrentUser(null)
  }

  // Práctica 4: GET /user/me/id dice quién soy y GET /user/{id} trae los roles
  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function loadProfile() {
      try {
        const myIdResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        if (!myIdResponse.ok) return
        const { id }: { id: number } = await myIdResponse.json()

        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        if (!response.ok) return
        const data: UserDetail = await response.json()
        if (!cancelled) setCurrentUser(data)
      } catch {
        // El saludo es decorativo: si falla, la lista igual se encarga de mostrar el error
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [token])

  if (!token) {
    return (
      <main className="page">
        <Login onLogin={handleLogin} />
      </main>
    )
  }

  const greeting = currentUser ? `Hola, ${currentUser.name}` : 'Hola'

  return (
    <main className="page">
      <header className="topbar">
        <h1>Usuarios</h1>
        <div className="session">
          <span>{greeting}</span>
          <button type="button" className="secondary" onClick={logout}>
            Salir
          </button>
        </div>
      </header>
      <UserList token={token} />
    </main>
  )
}
