import { useState } from 'react'

export default function Ej3() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="ej3">
      <article className="tarjeta">
        <h3 className="tarjeta__pregunta">¿Qué es React?</h3>

        {visible && (
          <p className="tarjeta__respuesta" id="respuesta">
            Es una biblioteca de JavaScript para construir interfaces de usuario
            a partir de componentes reutilizables.
          </p>
        )}

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-expanded={visible}
          aria-controls="respuesta"
        >
          {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
        </button>
      </article>
    </div>
  )
}
