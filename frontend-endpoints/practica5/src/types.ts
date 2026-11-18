export interface User {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
}

export interface Country {
  id: number
  name: string
}

export interface UserDetail extends User {
  email: string
  age: number
  country?: Country | null
  country_id?: number
  roles?: Array<string | Role>
}

export interface LoginResult {
  msg?: string
  token?: string
  access_token?: string
}

export type ApiErrorDetail = string | Array<{ msg?: string }>

export interface ApiErrorBody {
  detail?: ApiErrorDetail
}

/** Normaliza el `detail` que devuelve la API (string de FastAPI o lista de errores de validación). */
export function errorMessage(body: ApiErrorBody | null, fallback: string): string {
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const text = detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(', ')
    if (text) return text
  }
  return fallback
}

export function formatRoles(roles: UserDetail['roles']): string {
  if (!roles || roles.length === 0) return ''
  return roles
    .map((role) => (typeof role === 'string' ? role : role.name))
    .join(', ')
}

export function formatCountry(user: UserDetail): string {
  if (user.country) return user.country.name
  if (user.country_id === 1) return 'Argentina'
  if (user.country_id === 2) return 'Brasil'
  return '—'
}
