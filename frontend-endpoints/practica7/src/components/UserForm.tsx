import { useState } from 'react'
import type { FormEvent } from 'react'
import { errorMessage } from '../types'
import type { ApiErrorBody } from '../types'

interface Props {
  token: string
  onCreated: () => void
}

// No hay endpoint de países: las opciones van a mano
const COUNTRIES = [
  { id: 1, name: 'Argentina' },
  { id: 2, name: 'Brasil' },
]

export default function UserForm({ token, onCreated }: Props) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [countryId, setCountryId] = useState(COUNTRIES[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Práctica 5: age y country_id viajan como número
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          password,
          country_id: Number(countryId),
        }),
      })
      if (!response.ok) {
        const body: ApiErrorBody | null = await response.json().catch(() => null)
        throw new Error(errorMessage(body, `Error ${response.status}`))
      }
      // Práctica 5: mostramos lo que responde la API (POST /user devuelve { id })
      const body: { id?: number } | null = await response.json().catch(() => null)
      setMessage(body?.id !== undefined ? `Usuario creado con id ${body.id}` : 'Usuario creado')
      setName('')
      setAge('')
      setEmail('')
      setPassword('')
      setCountryId(COUNTRIES[0].id)
      // Refresca la lista sin recargar la página
      onCreated()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Alta de usuario</h2>

      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert ok">{message}</p>}

      <div className="fields">
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Edad
          <input
            type="number"
            min={0}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            minLength={4}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label>
          País
          <select
            value={countryId}
            onChange={(event) => setCountryId(Number(event.target.value))}
          >
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  )
}
