import { useState } from 'react'

const LENGUAJES = [
  'JavaScript',
  'Java',
  'TypeScript',
  'Python',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'PHP',
]

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('')

  const resultados = LENGUAJES.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="ej6">
      <section className="buscador">
        <label htmlFor="busqueda">Buscar lenguaje</label>
        <input
          id="busqueda"
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Ej: ja"
          autoComplete="off"
        />

        <p className="buscador__cantidad">
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
        </p>

        {resultados.length === 0 ? (
          <p className="buscador__vacio">No se encontraron resultados</p>
        ) : (
          <ul className="buscador__lista">
            {resultados.map((lenguaje) => (
              <li key={lenguaje}>{lenguaje}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
