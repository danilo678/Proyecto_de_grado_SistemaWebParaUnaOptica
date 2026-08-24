-- ============================================
-- SISTEMA DE GESTIÓN INTEGRAL DE ÓPTICA
-- Base de datos PostgreSQL
-- ============================================

-- 1. Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL CHECK (nombre ~ $re$^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$re$),
    apellido VARCHAR(100) CHECK (apellido IS NULL OR apellido ~ $re$^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$re$),
    ci VARCHAR(30) UNIQUE NOT NULL CHECK (ci ~ '^[0-9]{3,15}$'),
    usuario VARCHAR(50) UNIQUE NOT NULL CHECK (usuario ~ '^[a-zA-Z0-9._]{3,50}$'),
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) CHECK (telefono IS NULL OR telefono ~ '^[0-9]{6,15}$'),
    direccion VARCHAR(100),
    rol_id INT NOT NULL REFERENCES roles(id)
);

-- 3. Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(30) UNIQUE NOT NULL CHECK (ci ~ '^[0-9]{3,15}$'),
    nombre VARCHAR(100) NOT NULL CHECK (nombre ~ $re$^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$re$),
    apellido VARCHAR(100) CHECK (apellido IS NULL OR apellido ~ $re$^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$re$),
    telefono VARCHAR(30) CHECK (telefono IS NULL OR telefono ~ '^[0-9]{6,15}$'),
    sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Recetas / Prescripciones
CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    clinica_externa VARCHAR(150),
    esfera_od NUMERIC(5,2),
    cilindro_od NUMERIC(5,2),
    eje_od SMALLINT,
    add_od NUMERIC(5,2),
    dp_od NUMERIC(5,2),
    esfera_os NUMERIC(5,2),
    cilindro_os NUMERIC(5,2),
    eje_os SMALLINT,
    add_os NUMERIC(5,2),
    dp_os NUMERIC(5,2),
    observaciones TEXT
);

-- 5. Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) UNIQUE NOT NULL
);

-- 6. Productos / Inventario
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categorias(id),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    color VARCHAR(50),
    precio_compra NUMERIC(10,2) DEFAULT 0,
    precio_venta NUMERIC(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 0
);

-- 7. Ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    usuario_id INT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) DEFAULT 0,
    metodo_pago VARCHAR(30) DEFAULT 'EFECTIVO' CHECK (metodo_pago IS NULL OR metodo_pago IN ('EFECTIVO', 'QR', 'TARJETA', 'TRANSFERENCIA'))
);

-- 8. Detalle de venta
CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id),
    cantidad INT DEFAULT 1,
    precio_unitario NUMERIC(10,2) DEFAULT 0,
    subtotal NUMERIC(10,2) DEFAULT 0
);

-- 9. Órdenes de trabajo
CREATE TABLE orden_trabajo (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    receta_id INT REFERENCES recetas(id),
    venta_id INT REFERENCES ventas(id),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN PROCESO', 'LISTO PARA ENTREGA', 'ENTREGADO')),
    observaciones TEXT
);

-- 10. Recibos
CREATE TABLE recibos (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL UNIQUE REFERENCES ventas(id) ON DELETE CASCADE,
    numero_recibo VARCHAR(20) UNIQUE NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_pagado NUMERIC(10,2) NOT NULL DEFAULT 0,
    saldo NUMERIC(10,2) NOT NULL DEFAULT 0,
    fecha_entrega TIMESTAMP,
    observaciones TEXT
);
