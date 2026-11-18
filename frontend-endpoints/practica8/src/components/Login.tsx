import { useState } from 'react'
import type { FormEvent } from 'react'
import { errorMessage } from '../types'
import type { ApiErrorBody, LoginResult } from '../types'

interface Props {
  notice: string | null
  onLogin: (result: LoginResult) => void
}

export default function Login({ notice, onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const body: ApiErrorBody | null = await response.json().catch(() => null)
        throw new Error(errorMessage(body, 'No pudimos iniciar sesión'))
      }
      const data: LoginResult = await response.json()
      onLogin(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <h1>Ingresar</h1>
      <p className="muted">Usá el mail y la contraseña de tu usuario.</p>
      {notice && <p className="alert warn">{notice}</p>}
      {error && <p className="alert error">{error}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
