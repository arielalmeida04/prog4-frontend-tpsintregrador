import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { errorMessage } from '../types'
import type { ApiErrorBody, User } from '../types'
import UserDetail from './UserDetail'
import UserForm from './UserForm'

interface Props {
  token: string
}

export default function UserList({ token }: Props) {
  const [users, setUsers] = useState<User[]>([])
  // Práctica 1: el id elegido dispara el detalle
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [onlyAdults, setOnlyAdults] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setLoading(true)
      setError(null)
      try {
        const path = onlyAdults ? 'user_mayores' : 'user'
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        if (!response.ok) {
          const body: ApiErrorBody | null = await response.json().catch(() => null)
          throw new Error(errorMessage(body, `Error ${response.status}`))
        }
        const data: User[] = await response.json()
        if (!cancelled) setUsers(data)
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Error inesperado')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadUsers()
    return () => {
      cancelled = true
    }
  }, [refreshKey, onlyAdults, token])

  // Práctica 3: búsqueda por parte del nombre, con encodeURIComponent
  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = searchInput.trim()
    if (!name) return

    setLoading(true)
    setError(null)
    setSelectedId(null)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(name)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!response.ok) {
        const body: ApiErrorBody | null = await response.json().catch(() => null)
        throw new Error(errorMessage(body, `Error ${response.status}`))
      }
      const data: User[] = await response.json()
      setUsers(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  // Práctica 3: Limpiar vuelve a la lista completa
  function handleClear() {
    setSearchInput('')
    setSelectedId(null)
    setOnlyAdults(false)
    setRefreshKey((key) => key + 1)
  }

  return (
    <section className="layout">
      <div className="card list">
        <div className="toolbar">
          <form className="search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
            />
            <button type="submit">Buscar</button>
            <button type="button" className="secondary" onClick={handleClear}>
              Limpiar
            </button>
          </form>
          <button type="button" className="secondary" onClick={() => setOnlyAdults((value) => !value)}>
            {onlyAdults ? 'Ver todos' : 'Solo mayores'}
          </button>
        </div>

        <UserForm
          token={token}
          onCreated={() => setRefreshKey((key) => key + 1)}
        />

        {loading && <p className="muted">Cargando...</p>}

        {!loading && error && <p className="alert error">{error}</p>}

        {!loading && !error && (
          <table className="users">
            <thead>
              <tr>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={user.id === selectedId ? 'selected' : undefined}>
                  <td>
                    <button type="button" className="link" onClick={() => setSelectedId(user.id)}>
                      {user.name}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="muted">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedId !== null && (
        <UserDetail
          id={selectedId}
          token={token}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  )
}
