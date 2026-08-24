# 👓 Sistema de Gestión Integral de Óptica Victoria

Sistema web para la administración de la **Óptica Victoria** (Calle José Ignacio León esq. 6 de Octubre, Oruro · Tel. 73893488 · opticavictoria@gmail.com): inventario de monturas y lentes, clientes, recetas médicas, ventas con recibos, órdenes de trabajo y reportes.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + TailwindCSS + TanStack Query |
| Backend | NestJS 11 + TypeORM + JWT (Passport) |
| Base de datos | PostgreSQL 16 |
| Documentación API | Swagger (generada automáticamente) |
| Despliegue | Docker + docker-compose |

## Estructura del proyecto

```
Optica_v1/
├── database/
│   ├── tablas.sql     # Esquema completo de la BD
│   └── datos.sql      # Datos de prueba
├── backend/           # API REST (NestJS)
├── frontend/          # Aplicación web (React)
└── docker-compose.yml # Orquestación de los 3 servicios
```

---

## 🚀 Opción A: Ejecutar con Docker (recomendada)

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución

### Comandos

```bash
# Levantar todo (primera vez crea la BD e inserta los datos automáticamente)
docker compose up -d

# Ver el estado de los contenedores
docker compose ps

# Detener (conserva los datos)
docker compose down

# REINICIAR la base de datos desde cero (borra datos y vuelve a sembrar)
docker compose down -v
docker compose up -d

# Reconstruir tras cambios en el código
docker compose build
docker compose up -d
```

> ⚠️ La BD se inicializa sola **solo la primera vez** (directorio de datos vacío). Los scripts `tablas.sql` y `datos.sql` se ejecutan en ese orden automáticamente.

### URLs del sistema

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:5173 |
| API (Swagger) | http://localhost:3000/api/docs |
| PostgreSQL | localhost:5433 (usuario `postgres`, clave `1234`) |

---

## 💻 Opción B: Ejecutar manualmente (modo desarrollo)

### Requisitos
- Node.js 18+
- PostgreSQL 14+ corriendo localmente

### 1. Base de datos
Crear la base `optica_db` y ejecutar dentro de ella:
```bash
psql -U postgres -d optica_db -f database/tablas.sql
psql -U postgres -d optica_db -f database/datos.sql
```

### 2. Backend
```bash
cd backend
npm install
# Configurar .env (copiar de .env.example y ajustar credenciales)
npm run start:dev   # http://localhost:3000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev         # http://localhost:5173 (proxy /api -> :3000 incluido)
```

---

## 🔑 Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `svargas` | `123456` | Administrador |
| `mlopez` | `123456` | Vendedor |
| `mario1` | `123456` | Vendedor |

### Permisos por rol

| Módulo | Administrador | Vendedor |
|---|---|---|
| Dashboard y Reportes | ✅ | ❌ |
| Usuarios | ✅ | ❌ |
| Clientes, Recetas, Ventas, Órdenes | ✅ total | ✅ sin eliminar |
| Productos (Inventario) | ✅ total | 👁️ solo lectura |

## 📋 Módulos

- **Dashboard**: ingresos, ventas del día, stock bajo, últimas ventas
- **Usuarios**: gestión de cuentas y roles
- **Clientes**: registro con CI/teléfono validados
- **Recetas médicas**: valores ópticos por ojo (esfera, cilindro, eje, adición, DP)
- **Inventario**: monturas y lentes con precios, stock y stock mínimo
- **Ventas**: carrito, pago total o a cuenta con saldo, generación automática de recibo descargable (PDF)
- **Órdenes de trabajo**: seguimiento de montaje (Pendiente → En Proceso → Listo → Entregado), PDF de la orden con su venta asociada
- **Reportes**: ventas por mes, por vendedor y productos más vendidos

## 🔒 Validaciones aplicadas (4 niveles)

1. **PostgreSQL**: restricciones CHECK (CI numérico, teléfonos, nombres, estados y métodos de pago válidos)
2. **Backend**: DTOs con `class-validator`
3. **Frontend**: esquemas Zod idénticos al backend
4. **Inputs**: filtros en vivo (los campos numéricos bloquean letras mientras se escribe)
