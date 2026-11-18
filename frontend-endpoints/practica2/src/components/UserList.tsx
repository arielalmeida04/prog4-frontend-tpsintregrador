import { useEffect, useState } from 'react'
import { errorMessage } from '../types'
import type { ApiErrorBody, User } from '../types'
import UserDetail from './UserDetail'

interface Props {
  token: string
}

export default function UserList({ token }: Props) {
  const [users, setUsers] = useState<User[]>([])
  // Práctica 1: el id elegido dispara el detalle
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
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
  }, [token])

  return (
    <section className="layout">
      <div className="card list">

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
