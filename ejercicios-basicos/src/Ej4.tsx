import { useState } from 'react'

export default function Ej4() {
  const [celsius, setCelsius] = useState('')

  const vacio = celsius.trim() === ''
  const grados = Number(celsius)
  const fahrenheit = vacio ? null : (grados * 9) / 5 + 32
  const haceCalor = !vacio && grados > 30

  return (
    <div className="ej4">
      <section className="conversor">
        <label htmlFor="celsius">Grados Celsius</label>
        <div className="conversor__input">
          <input
            id="celsius"
            type="number"
            step="any"
            value={celsius}
            onChange={(event) => setCelsius(event.target.value)}
            placeholder="Ej: 35"
          />
          <span>°C</span>
        </div>

        <div className="conversor__resultado">
          <span>Equivalente en Fahrenheit</span>
          <strong>
            {fahrenheit === null ? '—' : `${fahrenheit.toFixed(1)} °F`}
          </strong>
        </div>

        {haceCalor && <p className="conversor__calor">🌡️ Hace calor</p>}
      </section>
    </div>
  )
}
