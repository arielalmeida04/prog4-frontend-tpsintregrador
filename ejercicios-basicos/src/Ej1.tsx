interface ProductoProps {
  nombre: string
  precio: number
  stock: number
}

function Producto({ nombre, precio, stock }: ProductoProps) {
  const sinStock = stock === 0

  return (
    <article className="producto">
      <h3 className="producto__nombre">{nombre}</h3>
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
  { nombre: 'Teclado mecánico', precio: 89999, stock: 0 },
]

export default function Ej1() {
  return (
    <div className="ej1">
      <section className="productos" aria-label="Lista de productos">
        {productos.map((producto) => (
          <Producto key={producto.nombre} {...producto} />
        ))}
      </section>
    </div>
  )
}
