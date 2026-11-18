import { useCallback, useEffect, useState } from 'react'
import Login from './components/Login'
import UserList from './components/UserList'
import { formatRoles } from './types'
import type { LoginResult, UserDetail } from './types'

const TOKEN_KEY = 'token'

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Práctica 8: una sola función cierra la sesión y el mensaje viaja al login
  const closeSession = useCallback((message: string | null) => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setCurrentUser(null)
    setNotice(message)
  }, [])

  const handleUnauthorized = useCallback(() => {
    closeSession('Tu sesión venció')
  }, [closeSession])

  function handleLogin(result: LoginResult) {
    const accessToken = result.access_token ?? result.token
    if (!accessToken) {
      throw new Error('La respuesta del login no trae token')
    }
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)
    setCurrentUser(null)
    setNotice(null)
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
        if (myIdResponse.status === 401) {
          handleUnauthorized()
          return
        }
        if (!myIdResponse.ok) return
        const { id }: { id: number } = await myIdResponse.json()

        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        if (response.status === 401) {
          handleUnauthorized()
          return
        }
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
  }, [token, handleUnauthorized])

  if (!token) {
    return (
      <main className="page">
        <Login notice={notice} onLogin={handleLogin} />
      </main>
    )
  }

  const roles = formatRoles(currentUser?.roles)
  const greeting = currentUser
    ? `Hola, ${currentUser.name}${roles ? ` (${roles})` : ''}`
    : 'Hola'

  return (
    <main className="page">
      <header className="topbar">
        <h1>Usuarios</h1>
        <div className="session">
          <span>{greeting}</span>
          <button type="button" className="secondary" onClick={() => closeSession(null)}>
            Salir
          </button>
        </div>
      </header>
      <UserList token={token} onUnauthorized={handleUnauthorized} />
    </main>
  )
}
