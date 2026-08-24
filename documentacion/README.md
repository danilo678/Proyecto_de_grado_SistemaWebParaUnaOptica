# Óptica Victoria — Sistema de Gestión Integral de Óptica

Sistema web para la gestión integral de clientes, inventario, recetas optométricas, ventas, órdenes de trabajo y reportes. Expone una API REST desarrollada con NestJS, frontend en React y base de datos PostgreSQL.

## 👤 Información

**Grupo:** 1
**Estudiante:**

- Danilo Aramayo Garisto

## Tecnologías Utilizadas para el Sistema

### Backend (`backend/`)

- **Runtime:** Node.js (Alpine)
- **Framework:** NestJS 11
- **ORM:** TypeORM
- **Autenticación:** JWT + Passport + bcrypt
- **Validación:** class-validator + class-transformer
- **Documentación API:** Swagger (OpenAPI)
- **Base de Datos:** PostgreSQL 16 (driver pg)

### Frontend (`frontend/`)

- **Framework:** React 19 (componentes funcionales + hooks)
- **Build:** Vite
- **Estilos:** Tailwind CSS 4
- **Cliente HTTP:** Axios (interceptor JWT)
- **Validación de formularios:** Zod
- **Gráficos:** Recharts

### Infraestructura

- **Contenedores:** Docker + Docker Compose
- **Base de Datos:** PostgreSQL 16 Alpine
- **Orquestación:** 3 servicios (db, backend, frontend)

## Descripción del Sistema

Óptica Victoria permite gestionar:

- **Usuarios** — Credenciales de acceso con roles (Administrador/Vendedor)
- **Clientes** — Registro, búsqueda por CI/nombre/teléfono e historial de atenciones
- **Productos** — Inventario con categorías, precios y alertas de stock mínimo
- **Recetas Optométricas** — Esfera, cilindro, eje y DP por ojo (OD/OS) por cliente
- **Ventas** — Carrito, descuento automático de stock, pago total o a cuenta y recibo PDF numerado
- **Órdenes de Trabajo** — Flujo PENDIENTE → EN PROCESO → LISTO PARA ENTREGA → ENTREGADO con PDF
- **Dashboard y Reportes** — Ventas por mes/vendedor, top productos, exportables a PDF (solo Administrador)

## Requisitos

- Docker + Docker Compose instalados
- Puertos 3000, 5173 y 5433 libres

## Cómo Ejecutar (Descargado de GitHub)

```bash
# 1. Clonar el repositorio
git clone https://github.com/ChimiShuri/PROYECTO-FINAL-GRUPO1.git
cd PROYECTO-FINAL-GRUPO1/Optica_v1

# 2. Iniciar todos los servicios
docker-compose up -d

# 3. Acceder al sistema
```

| Servicio | URL |
|---|---|
| Frontend (App funcional) | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/api/docs |

## Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| mlopez | 123456 | Vendedor |

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir y reiniciar un servicio específico
docker-compose up -d --build backend

# Detener conservando datos
docker-compose down

# Detener y eliminar todo (incluyendo datos)
docker-compose down -v

# Acceder a la base de datos
docker exec -it optica_db psql -U postgres -d optica_db
```

## Estructura del Proyecto

```
Optica_v1/
├── database/            # Scripts SQL (tablas + datos iniciales)
│   ├── tablas.sql       #   Esquema: 10 tablas con relaciones
│   └── datos.sql        #   Datos de prueba
├── backend/             # Backend NestJS
│   └── src/
│       ├── auth/          # Autenticación JWT
│       ├── usuarios/      # Gestión de usuarios
│       ├── clientes/      # CRUD de clientes
│       ├── categorias/    # Categorías de productos
│       ├── productos/     # Inventario
│       ├── recetas/       # Recetas optométricas OD/OS
│       ├── ventas/        # Ventas, detalles y recibos
│       ├── orden-trabajo/ # Órdenes de trabajo
│       ├── dashboard/     # Métricas y reportes
│       └── comun/         # Guards, decorators y filtros globales
├── frontend/            # Frontend React
│   └── src/
│       ├── pages/auth/      # Pantalla de inicio de sesión
│       ├── pages/admin/     # Dashboard, Clientes, Inventario,
│       │                    # Recetas, Ventas, Órdenes, Reportes, Usuarios
│       ├── components/layout/ # Sidebar + AdminLayout
│       ├── api/             # Cliente HTTP Axios
│       ├── context/         # Contexto de autenticación
│       ├── types/           # Tipos TypeScript compartidos
│       └── utils/           # Formateo y utilidades
└── docker-compose.yml   # Orquestación de servicios
```
