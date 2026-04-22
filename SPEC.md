# HitShop — Especificación del Proyecto

## 1. Información General

| Campo | Descripción |
|-------|-------------|
| **Nombre** | HitShop |
| **Tipo** | API REST para e-commerce |
| **Runtime** | Node.js / FastAPI |
| **Base de datos** | PostgreSQL |
| **Cache** | Redis |
| **Auth** | JWT |
| **Contenedores** | Docker |
| **Docs** | OpenAPI / Swagger |

---

## 2. Módulos

### 2.1 Inventario

#### Productos `/api/products`

| Método | Ruta | Descripción | Rol |
|--------|-----|-------------|-----|
| GET | `/products` | Listar con filtros y paginación | Público |
| GET | `/products/:id` | Detalle de producto | Público |
| POST | `/products` | Crear producto | Admin |
| PUT | `/products/:id` | Actualizar datos o stock | Admin |
| DELETE | `/products/:id` | Dar de baja | Admin |

#### Categorías `/api/categories`

| Método | Ruta | Descripción | Rol |
|--------|-----|-------------|-----|
| GET | `/categories` | Árbol de categorías | Público |
| POST | `/categories` | Crear categoría | Admin |

### 2.2 Usuarios

#### Auth `/api/auth`

| Método | Ruta | Descripción |
|--------|-----|-------------|
| POST | `/auth/register` | Crear cuenta |
| POST | `/auth/login` | Devuelve JWT |
| POST | `/auth/logout` | Invalida token |

#### Perfil `/api/users`

| Método | Ruta | Descripción |
|--------|-----|-------------|
| GET | `/users/me` | Datos del usuario actual |
| PUT | `/users/me` | Actualizar perfil |

---

## 3. Fases de Desarrollo

| Fase | Descripción | Duración |
|------|-------------|----------|
| **Fase 1** | Setup + Auth | Semanas 1–2 |
| **Fase 2** | Inventario | Semanas 3–5 |
| **Fase 3** | Integración + Docs | Semanas 6–7 |