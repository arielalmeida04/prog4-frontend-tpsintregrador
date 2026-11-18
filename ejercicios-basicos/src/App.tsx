import type { ComponentType } from 'react'
import Ej1 from './Ej1'
import Ej2 from './Ej2'
import Ej3 from './Ej3'
import Ej4 from './Ej4'
import Ej5 from './Ej5'
import Ej6 from './Ej6'
import Ej7 from './Ej7'

interface Ejercicio {
  id: number
  titulo: string
  Componente: ComponentType
}

const ejercicios: Ejercicio[] = [
  { id: 1, titulo: 'Ejercicio 1 · Tarjetas de producto (Props)', Componente: Ej1 },
  { id: 2, titulo: 'Ejercicio 2 · Contador con límites (useState)', Componente: Ej2 },
  { id: 3, titulo: 'Ejercicio 3 · Mostrar y ocultar (Condicionales)', Componente: Ej3 },
  { id: 4, titulo: 'Ejercicio 4 · Conversor de temperatura (Inputs controlados)', Componente: Ej4 },
  { id: 5, titulo: 'Ejercicio 5 · Lista de compras (Listas y estado)', Componente: Ej5 },
  { id: 6, titulo: 'Ejercicio 6 · Buscador (Filtrado)', Componente: Ej6 },
  { id: 7, titulo: 'Ejercicio 7 · Tipar con TypeScript', Componente: Ej7 },
]

export default function App() {
  return (
    <main className="page">
      <header className="page__header">
        <h1>React desde cero</h1>
        <p>Los siete ejercicios en un único proyecto Vite + TypeScript</p>
      </header>

      {ejercicios.map(({ id, titulo, Componente }) => (
        <section key={id} className="ejercicio">
          <h2 className="ejercicio__titulo">{titulo}</h2>
          <Componente />
        </section>
      ))}
    </main>
  )
}
