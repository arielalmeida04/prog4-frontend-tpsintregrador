# Práctica 5

Incluye lo resuelto en las prácticas **1 a 5**.

## Funcionalidad

- Proyecto React + TypeScript creado con Vite.
- - Login con token en `localStorage` y listado de usuarios
- - Detalle del usuario al hacer clic en su nombre (Práctica 1)
- - Listado con "Cargando..." y manejo de errores de la API (Práctica 2)
- - Búsqueda por nombre con `encodeURIComponent` y botón Limpiar (Práctica 3)
- - Saludo con nombre y roles: `Hola, Martina Gómez (ADMIN)` (Práctica 4)
- - Alta de usuario con formulario y refresco de la lista (Práctica 5)

## Cómo correrlo

Necesita la API de la cátedra en `http://localhost:8000`.

```bash
npm install
cp .env.example .env
npm run dev
```

Abrir la URL que imprime Vite (por defecto `http://localhost:5173`).

## Usuarios de prueba

| Email | Rol | Contraseña |
| --- | --- | --- |
| `mgomez@email.com` | ADMIN | `123` |
| `sfer@email.com` | REGULAR | `123` |

## Estructura

```
src/
├── main.tsx              Punto de entrada
├── App.tsx               Sesión, token y saludo
├── types.ts              Tipos de la API
├── index.css             Estilos
└── components/
    ├── Login.tsx         Ingreso
    ├── UserList.tsx      Lista y acciones
    ├── UserDetail.tsx    Detalle del usuario
    └── UserForm.tsx     Alta de usuario
```

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # compila TypeScript y genera dist/
npm run preview  # sirve la compilación
npm run lint     # análisis estático
```
