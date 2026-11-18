# Programación IV — React

Trabajos prácticos de frontend con React y TypeScript.

- **`ejercicios-basicos/`**: los 7 ejercicios de "React desde cero" en un único
  proyecto Vite, cada uno en su componente (`Ej1.tsx` … `Ej7.tsx`).
- **`frontend-endpoints/`**: las 8 prácticas de la guía de endpoints. Cada carpeta
  `practicaN/` es un proyecto completo y funcionando hasta la práctica N inclusive
  (por ejemplo, `practica3` incluye lo de las prácticas 1, 2 y 3).

La práctica 9 no tiene carpeta porque es de análisis: sus respuestas y las del
resto de consignas "para pensar" están en [`RESPUESTAS.md`](RESPUESTAS.md).

## Estructura

```
programacion4-react/
├── README.md
├── RESPUESTAS.md
├── ejercicios-basicos/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig*.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx          Punto de entrada
│       ├── App.tsx           Muestra los 7 ejercicios con su título
│       ├── Ej1.tsx           Tarjetas de producto (props)
│       ├── Ej2.tsx           Contador con límites (useState)
│       ├── Ej3.tsx           Mostrar y ocultar (condicionales)
│       ├── Ej4.tsx           Conversor de temperatura (inputs controlados)
│       ├── Ej5.tsx           Lista de compras (listas y estado)
│       ├── Ej6.tsx           Buscador (filtrado)
│       ├── Ej7.tsx           Tipar con TypeScript
│       └── index.css
└── frontend-endpoints/
    ├── practica1/            Login + listado + detalle
    ├── practica2/            ... + "Cargando..." y errores
    ├── practica3/            ... + búsqueda por nombre
    ├── practica4/            ... + roles en el saludo
    ├── practica5/            ... + alta de usuario
    ├── practica6/            ... + solo mayores
    ├── practica7/            ... + borrar usuario
    └── practica8/            ... + sesión vencida
```

Cada práctica tiene la misma estructura interna:

```
practicaN/
├── .env.example          Variable VITE_API_URL (sin secretos)
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx           Sesión, token y saludo
    ├── types.ts          Tipos de la API
    ├── index.css
    └── components/
        ├── Login.tsx
        ├── UserList.tsx
        ├── UserDetail.tsx
        └── UserForm.tsx  (desde practica5)
```

## Cómo correr los ejercicios básicos

No necesitan backend:

```bash
cd ejercicios-basicos
npm install
npm run dev
```

Abrir la URL que imprime Vite (por defecto `http://localhost:5173`).

## Cómo correr las prácticas de endpoints

Necesitan la API de la cátedra (FastAPI + SQLite) en `http://localhost:8000`.

1. Levantar el backend:

   ```bash
   cd <carpeta-del-backend>
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. En otra terminal, entrar a la práctica y levantarla:

   ```bash
   cd frontend-endpoints/practica1
   npm install
   cp .env.example .env
   npm run dev
   ```

   Cambiar `practica1` por la práctica que se quiera ver. Cada una usa un puerto
   de Vite distinto solo si se levantan varias a la vez (Vite avisa y ofrece otro).

Si el backend está en otra dirección, editar `VITE_API_URL` en el `.env`.

### Usuarios de prueba

Todos usan la contraseña `123`.

| Email | Rol | Sirve para |
| --- | --- | --- |
| `mgomez@email.com` | ADMIN | Listar, crear y borrar |
| `sfer@email.com` | REGULAR | Ver los 403 al crear y borrar |

## API que consumen las prácticas

| Acción | Endpoint | Respuesta |
| --- | --- | --- |
| Login | `POST /login` `{ email, password }` | `{ msg, token }` |
| Usuario logueado | `GET /user/me/id` | `{ id }` |
| Lista | `GET /user` | `[{ id, name }]` |
| Búsqueda | `GET /user/search/{name}` | usuarios |
| Mayores | `GET /user_mayores` | usuarios |
| Detalle | `GET /user/{id}` | `{ id, name, email, age, country, roles }` |
| Alta | `POST /user` | `{ id }` |
| Borrado | `DELETE /user/{id}` | `{ msg }` o 403 |

Los errores se leen de `{ "detail": "..." }`. Un `401` cierra la sesión y vuelve
al login con el mensaje "Tu sesión venció" (desde `practica8`).

## Notas

- Todos los proyectos usan React 19, TypeScript y Vite.
- No se incluye `node_modules` ni archivos `.env`: cada proyecto trae su
  `.env.example` con las variables necesarias y sin valores reales.
- Los proyectos se generaron de forma incremental: `practicaN` contiene
  exactamente las funcionalidades de las prácticas 1 a N.
