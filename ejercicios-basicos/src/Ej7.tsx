interface ProductoProps {
  nombre: string
  precio: number
  stock: number
  oferta?: boolean
}

function Producto({ nombre, precio, stock, oferta = false }: ProductoProps) {
  const sinStock = stock === 0

  return (
    <article className="producto">
      <div className="producto__encabezado">
        <h3 className="producto__nombre">{nombre}</h3>
        {oferta && <span className="producto__oferta">¡Oferta!</span>}
      </div>
      <p className="producto__precio">${precio.toLocaleString('es-AR')}</p>
      <p className={`producto__stock${sinStock ? ' producto__stock--vacio' : ''}`}>
        {sinStock ? 'Sin stock' : `Stock: ${stock}`}
      </p>
    </article>
  )
}

const productos: ProductoProps[] = [
  { nombre: 'Notebook Gamer', precio: 1250000, stock: 8 },
  { nombre: 'Mouse inalámbrico', precio: 45999, stock: 3 },
  { nombre: 'Teclado mecánico', precio: 89999, stock: 0, oferta: true },
]

export default function Ej7() {
  return (
    <div className="ej7">
      <section className="productos" aria-label="Lista de productos">
        {productos.map((producto) => (
          <Producto key={producto.nombre} {...producto} />
        ))}
      </section>
    </div>
  )
}
