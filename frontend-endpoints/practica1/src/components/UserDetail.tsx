import { useEffect, useState } from 'react'
import { formatCountry, formatRoles } from '../types'
import type { UserDetail as UserDetailData } from '../types'

interface Props {
  id: number
  token: string
  onClose: () => void
}

export default function UserDetail({ id, token, onClose }: Props) {
  const [user, setUser] = useState<UserDetailData | null>(null)

  // Práctica 1: el useEffect depende del id elegido
  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data: UserDetailData) => {
        if (!cancelled) setUser(data)
      })

    return () => {
      cancelled = true
    }
  }, [id, token])

  return (
    <aside className="card detail">
      <div className="detail-header">
        <h2>Detalle</h2>
        <button type="button" className="secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>

      {user && (
        <dl>
          <dt>Nombre</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Edad</dt>
          <dd>{user.age}</dd>
          <dt>País</dt>
          <dd>{formatCountry(user)}</dd>
          <dt>Roles</dt>
          <dd>{formatRoles(user.roles) || '—'}</dd>
        </dl>
      )}
    </aside>
  )
}
