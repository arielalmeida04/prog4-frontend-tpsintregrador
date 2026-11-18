import { useState } from 'react'
import type { FormEvent } from 'react'

interface Item {
  id: number
  texto: string
}

export default function Ej5() {
  const [items, setItems] = useState<Item[]>([])
  const [texto, setTexto] = useState('')

  const agregar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nuevo = texto.trim()

    if (nuevo === '') return

    setItems([...items, { id: Date.now(), texto: nuevo }])
    setTexto('')
  }

  const eliminar = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="ej5">
      <section className="lista">
        <form className="lista__formulario" onSubmit={agregar}>
          <input
            type="text"
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="¿Qué necesitás comprar?"
            aria-label="Nuevo ítem"
          />
          <button type="submit">Agregar</button>
        </form>

        {items.length === 0 ? (
          <p className="lista__vacia">No hay nada para comprar</p>
        ) : (
          <ul className="lista__items">
            {items.map((item) => (
              <li key={item.id} className="lista__item">
                <span>{item.texto}</span>
                <button
                  type="button"
                  className="lista__eliminar"
                  onClick={() => eliminar(item.id)}
                  aria-label={`Eliminar ${item.texto}`}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
