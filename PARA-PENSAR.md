# Consignas "para pensar"

Respuestas a las consignas de análisis de la práctica de endpoints. Los números
salen de `frontend-endpoints/practica8/`, que es la versión con todas las
funcionalidades.

---

## Práctica 1 — ¿Por qué la lista no trae todos los datos?

En Network se ve la diferencia:

| Pedido | Respuesta |
| --- | --- |
| `GET /user` | `[{ "id": 1, "name": "Martina Gómez" }, ...]` |
| `GET /user/{id}` | `{ "id": 1, "name": "...", "email": "...", "age": 31, "country": { "id": 1, "name": "Argentina" }, "roles": ["ADMIN"] }` |

La lista manda solo `id` y `name` porque es un **índice**: lo único que necesita
la tabla para dibujarse y para saber a quién pedirle el detalle. El resto de los
datos se pide recién cuando el usuario hace clic en una fila.

Ventajas de ese diseño:

- **Menos bytes.** El detalle pesa varias veces más que `id + name`; multiplicado
  por cada fila, la diferencia es enorme.
- **Se transfiere solo lo que se usa.** De 10 usuarios se abre el detalle de uno
  o dos; mandar los 10 completos sería gastar red en datos que nadie mira.
- **Respuesta más rápida.** Un JSON chico se transfiere, se parsea y se renderiza
  antes. En una tabla, eso se nota.
- **Menos datos sensibles dando vueltas.** El email o la edad no viajan en un
  pedido masivo.
- **Menos acoplamiento.** Si mañana el detalle suma campos, la lista no cambia.

El costo es un segundo pedido por cada clic. Es un buen negocio: se paga una vez,
solo cuando hace falta, en lugar de pagarlo siempre para todos.

### ¿Y con 10.000 usuarios?

Ahí el problema deja de ser teórico:

- `GET /user` con solo `id + name` ya son ~10.000 objetos; con todos los campos
  serían varios MB. En una conexión móvil eso son segundos de espera y un JSON
  que hay que parsear entero antes de pintar la primera fila.
- El navegador tiene que crear 10.000 filas de tabla. Aunque los datos lleguen,
  el DOM se vuelve lento; haría falta paginación o virtualización.
- Cualquier recarga vuelve a bajar todo.

Por eso el diseño correcto a esa escala es **paginar en el servidor**
(`GET /user?limit=50&offset=0`) y seguir pidiendo el detalle por separado. La API
de la cátedra no pagina, pero el principio es el mismo: la lista es un resumen y
el detalle se pide aparte.

---

## Práctica 7 — ¿Está bien que el botón "Borrar" aparezca igual?

**No del todo, aunque no es un agujero de seguridad.**

En mi entrega el botón aparece para todos los usuarios y, si el backend responde
`403 Missing permission: delete_users`, muestro ese mensaje (lo probé con
`sfer@email.com`). Funciona porque **la API es la que autoriza**: el `403` frena
el borrado igual, aunque el botón esté visible. Ocultarlo en el frontend nunca
reemplaza ese control.

Dicho eso, mostrar una acción que el usuario no puede hacer es mala experiencia:

- El usuario hace clic, confirma, y recién ahí descubre que no tenía permiso.
- Parece un error de la aplicación, no una restricción.
- Invita a intentar acciones que siempre van a fallar.

Lo ideal es **ocultar o deshabilitar** el botón según el rol, que ya conocemos por
`GET /user/{id}` (Práctica 4):

```tsx
const puedeBorrar = currentUser?.roles.includes('ADMIN') ?? false
// ...
{puedeBorrar && <button onClick={() => handleDelete(user.id, user.name)}>Borrar</button>}
```

Con dos recaudos:

1. Esconder el botón es **solo cosmético**. El `403` se sigue manejando y
   mostrando, porque el rol puede cambiar o alguien puede llamar a la API
   directamente.
2. Los nombres de los roles son parte del contrato de la API. Si cambian, hay que
   actualizar el frontend.

En resumen: el botón visible + mensaje de error es aceptable como ejercicio
porque el backend manda, pero una interfaz mejor lo esconde y deja el `403` como
red de seguridad.

---

## Práctica 9 — Contar y pensar el costo del cambio

### Conteo en `practica8/`

| Búsqueda | Veces | Dónde |
| --- | --- | --- |
| `import.meta.env.VITE_API_URL` | **9** (8 `fetch` + 1 declaración de tipos) | `App.tsx` ×2, `UserList.tsx` ×3, `UserDetail.tsx` ×1, `UserForm.tsx` ×1, `Login.tsx` ×1, `vite-env.d.ts` ×1 |
| `` Authorization: `Bearer ${token}` `` | **7** | `App.tsx` ×2, `UserList.tsx` ×3, `UserDetail.tsx` ×1, `UserForm.tsx` ×1 |
| `if (!response.ok)` | **7** | `UserList.tsx` ×3, `App.tsx` ×1, `UserDetail.tsx` ×1, `UserForm.tsx` ×1, `Login.tsx` ×1 |
| `useState` para `loading` y `error` | **4 pares** (8 estados) | `Login`, `UserList`, `UserDetail`, `UserForm` |
| `response.status === 401` | **7** | `UserList.tsx` ×3, `App.tsx` ×2, `UserDetail.tsx` ×1, `UserForm.tsx` ×1 |

### Si el backend cambia el header del token

Habría que tocar **4 archivos y 7 lugares** (`App.tsx`, `UserList.tsx`,
`UserDetail.tsx`, `UserForm.tsx`). El `VITE_API_URL` está repetido 8 veces y el
chequeo de `401`, 7 veces. Es decir: un cambio de una línea en el backend obliga
a una búsqueda y reemplazo en todo el frontend.

### ¿Y si me olvido de uno?

No falla al compilar: falla en tiempo de ejecución, y de las peores formas.

- **Header de token olvidado:** ese pedido viaja sin `Authorization`. La API
  responde `401` y, desde la Práctica 8, la aplicación cierra la sesión y muestra
  "Tu sesión venció". El usuario ve que lo expulsan sin motivo aparente y es
  difícil de rastrear, porque solo pasa en una pantalla.
- **`!response.ok` olvidado:** el error se ignora. Por ejemplo, un borrado que
  devolvió `403` se toma como exitoso y el usuario desaparece de la lista aunque
  en la base siga existiendo. Peor: el error queda invisible.
- **Chequeo de `401` olvidado:** esa vista no cierra la sesión; el usuario queda
  con un token inválido y ve errores sueltos en lugar de volver al login.
- **`VITE_API_URL` olvidado:** ese pedido va a otra URL y falla por red o CORS,
  solo en esa parte de la aplicación.

El problema de fondo es la **duplicación**: la misma decisión (cómo se arma un
pedido, cómo se lee un error, qué hacer con un `401`) está escrita siete veces.

### La solución: un único módulo de API

Centralizar el `fetch` en un archivo elimina las repeticiones:

```ts
// src/api.ts
const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

export class UnauthorizedError extends Error {}

export async function apiFetch<T>(
  path: string,
  { token, ...init }: RequestInit & { token?: string } = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (response.status === 401) throw new UnauthorizedError()

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(errorMessage(body, `Error ${response.status}`), response.status)
  }

  return response.json()
}
```

Con eso:

| Cambio | Antes | Después |
| --- | --- | --- |
| Otro header de token | 4 archivos, 7 lugares | **1 línea** en `api.ts` |
| Cambiar la URL base | 8 lugares | **1 línea** |
| Agregar un endpoint | repetir `fetch` + `ok` + `401` | **1 llamada** a `apiFetch` |
| Olvidarse un chequeo | posible | **imposible**: está en un solo lugar |

Y el `401` se resuelve una sola vez: `App` le pasa a `apiFetch` (o a un
interceptor) la función que cierra la sesión, y cualquier pedido que reciba `401`
dispara el mismo camino.

La conclusión de la consigna es esa: mientras el código esté duplicado, cada
cambio es una oportunidad de olvidarse de un lugar. Centralizar convierte un
cambio de siete puntos en un cambio de uno.
