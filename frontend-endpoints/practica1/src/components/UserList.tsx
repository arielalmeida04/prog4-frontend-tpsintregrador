import { useEffect, useState } from 'react'
import type { User } from '../types'
import UserDetail from './UserDetail'

interface Props {
  token: string
}

export default function UserList({ token }: Props) {
  const [users, setUsers] = useState<User[]>([])
  // Práctica 1: el id elegido dispara el detalle
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
  }, [token])

  return (
    <section className="layout">
      <div className="card list">

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
