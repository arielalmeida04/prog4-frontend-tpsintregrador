import { useState } from 'react'

const MIN = 0
const MAX = 10

export default function Ej2() {
  const [valor, setValor] = useState(MIN)

  const restar = () => setValor((actual) => Math.max(MIN, actual - 1))
  const sumar = () => setValor((actual) => Math.min(MAX, actual + 1))
  const reiniciar = () => setValor(MIN)

  return (
    <div className="ej2">
      <section className="contador" aria-label="Contador">
        <p className="contador__rango">Rango: {MIN} – {MAX}</p>
        <p className="contador__valor">{valor}</p>

        <div className="contador__botones">
          <button type="button" onClick={restar} disabled={valor === MIN}>
            − Restar
          </button>
          <button type="button" onClick={sumar} disabled={valor === MAX}>
            + Sumar
          </button>
          <button
            type="button"
            className="contador__reiniciar"
            onClick={reiniciar}
            disabled={valor === MIN}
          >
            Reiniciar
          </button>
        </div>
      </section>
    </div>
  )
}
