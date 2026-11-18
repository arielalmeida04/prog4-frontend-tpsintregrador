import { useEffect, useState } from 'react'
import { formatCountry, formatRoles } from '../types'
import { errorMessage } from '../types'
import type { ApiErrorBody } from '../types'
import type { UserDetail as UserDetailData } from '../types'

interface Props {
  id: number
  token: string
  onClose: () => void
}

export default function UserDetail({ id, token, onClose }: Props) {
  const [user, setUser] = useState<UserDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Práctica 1: el useEffect depende del id elegido
  useEffect(() => {
    let cancelled = false

    async function loadDetail() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return
        if (!response.ok) {
          const body: ApiErrorBody | null = await response.json().catch(() => null)
          throw new Error(errorMessage(body, `Error ${response.status}`))
        }
        const data: UserDetailData = await response.json()
        if (!cancelled) setUser(data)
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Error inesperado')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetail()
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

      {loading && <p className="muted">Cargando...</p>}
      {!loading && error && <p className="alert error">{error}</p>}

      {!loading && !error && user && (
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
