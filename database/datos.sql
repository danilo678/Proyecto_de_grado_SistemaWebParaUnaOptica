-- ============================================
-- DATOS DE PRUEBA - OPTICA
-- Contraseñas: admin123 (Administrador General) / 123456 (resto)
-- ============================================

-- Roles
INSERT INTO roles (nombre) VALUES
('Administrador'),
('Vendedor');

-- Usuarios
INSERT INTO usuarios
(nombre, apellido, ci, usuario, password, telefono, direccion, rol_id)
VALUES
('Admin', 'General', '2234567', 'admin', '$2b$10$T1E3.9yikLDWz9goqdzzk.H6xjW0veArSkDSDqoFr.H5ut7JEzb1W', '70000001', 'Av. Circunvalacion 100', 1),
('Sofia', 'Vargas', '3345678', 'svargas', '$2b$10$HC31JI7nIHPK0OXRfKF.6epLUeWcH3IqtkM6oAabVjbzwmLzyybya', '70000002', 'Av. 6 de Octubre 250', 1),
('Maria', 'Lopez', '5512345', 'mlopez', '$2b$10$HC31JI7nIHPK0OXRfKF.6epLUeWcH3IqtkM6oAabVjbzwmLzyybya', '71234567', 'Zona Norte', 2),
('Mario', 'Perez', '6623456', 'mario1', '$2b$10$HC31JI7nIHPK0OXRfKF.6epLUeWcH3IqtkM6oAabVjbzwmLzyybya', '72345678', 'Barrio San Jose', 2);

-- Clientes
INSERT INTO clientes (ci, nombre, apellido, telefono, sexo) VALUES
('4587213', 'Carlos', 'Gomez', '70123456', 'M'),
('3698541', 'Ana', 'Fernandez', '70234567', 'F'),
('5521478', 'Luis', 'Mamani', '70345678', 'M'),
('6632589', 'Carmen', 'Quispe', '70456789', 'F'),
('7743690', 'Roberto', 'Flores', '70567890', 'M'),
('8854701', 'Patricia', 'Huanca', '70678901', 'F'),
('9965812', 'Jorge', 'Choque', '70789012', 'M'),
('1122334', 'Rosa', 'Martinez', '70890123', 'F'),
('2233445', 'Daniel', 'Torrez', '70901234', 'M'),
('3344556', 'Lucia', 'Salazar', '70012345', 'F');

-- Recetas
INSERT INTO recetas
(cliente_id, fecha, clinica_externa,
 esfera_od, cilindro_od, eje_od, add_od, dp_od,
 esfera_os, cilindro_os, eje_os, add_os, dp_os,
 observaciones)
VALUES
(1, '2026-06-15', 'Clinica Visual Oruro', -1.50, -0.50, 90, 2.00, 31.50, -1.25, -0.75, 85, 2.00, 31.00, 'Uso permanente'),
(2, '2026-07-02', 'Centro Oftalmologico', -2.00, -1.00, 100, 2.50, 32.00, -1.75, -0.50, 95, 2.50, 32.00, 'Control anual'),
(3, '2026-07-10', 'Optica Vision', -0.50, NULL, NULL, NULL, 32.50, -0.75, NULL, NULL, NULL, 32.00, 'Uso de cerca'),
(4, '2026-07-18', 'Clinica del Oeste', 1.00, -0.25, 180, 2.25, 31.00, 1.25, -0.50, 175, 2.25, 30.50, 'Presbicia incipiente'),
(5, '2026-07-25', 'Centro Visual Bolivia', -3.00, -1.25, 60, NULL, 33.00, -2.75, -1.00, 120, NULL, 32.50, 'Miopia moderada'),
(6, '2026-08-05', 'Clinica Visual Oruro', -1.00, -0.50, 90, 2.00, 31.50, -1.00, -0.25, 90, 2.00, 31.50, 'Antifatiga'),
(8, '2026-08-12', 'Optica Central', 0.50, NULL, NULL, NULL, 31.50, 0.50, NULL, NULL, NULL, 31.00, 'Revision semestral');

-- Categorías
INSERT INTO categorias (nombre) VALUES
('Monturas'),
('Lentes');

-- Monturas (10)
INSERT INTO productos
(categoria_id, codigo, nombre, descripcion, marca, color, precio_compra, precio_venta, stock, stock_minimo)
VALUES
(1, 'MON001', 'Montura Metalica Classic', 'Montura metalica clasica', 'RayVision', 'Negro', 60, 100, 11, 3),
(1, 'MON002', 'Montura Acetato Milano', 'Acetato italiano ligero', 'OptiLens', 'Cafe', 70, 120, 9, 3),
(1, 'MON003', 'Montura Titanio Flex', 'Titanio flexible ultrafina', 'FlexOptic', 'Gris', 110, 180, 6, 2),
(1, 'MON004', 'Montura Rimless Elegance', 'Sin aro, tornillos de titanio', 'Elegance', 'Dorado', 90, 150, 8, 2),
(1, 'MON005', 'Montura Deportiva SportVision', 'Antideslizante para deporte', 'SportVision', 'Azul', 80, 130, 7, 2),
(1, 'MON006', 'Montura Infantil KidsVision', 'Flexible para niños', 'KidsVision', 'Rojo', 45, 80, 9, 2),
(1, 'MON007', 'Montura Cat Eye Vintage', 'Estilo retro femenino', 'VintageOptic', 'Negro', 65, 110, 5, 2),
(1, 'MON008', 'Montura Cuadrada Urban', 'Diseño urbano moderno', 'UrbanOptic', 'Azul Marino', 60, 105, 10, 3),
(1, 'MON009', 'Montura Redonda Retro', 'Estilo retro redondo', 'RetroWear', 'Marron', 62, 110, 6, 2),
(1, 'MON010', 'Montura Ligera TR90 AirLight', 'Material TR90 ultraliviano', 'AirLight', 'Negro', 75, 125, 12, 4);

-- Lentes (10)
INSERT INTO productos
(categoria_id, codigo, nombre, descripcion, marca, color, precio_compra, precio_venta, stock, stock_minimo)
VALUES
(2, 'LEN001', 'Lente Antirreflejo CR39', 'Monofocal con tratamiento AR', 'OptiLens', 'Transparente', 50, 90, 18, 5),
(2, 'LEN002', 'Lente Blue Light', 'Filtro luz azul antifatiga', 'VisionPro', 'Transparente', 65, 110, 13, 4),
(2, 'LEN003', 'Lente Fotocromatico', 'Se oscurece al sol', 'SunLens', 'Gris', 95, 160, 8, 2),
(2, 'LEN004', 'Lente Bifocal CR39', 'Lejos y cerca en un lente', 'OptiLens', 'Transparente', 55, 100, 10, 3),
(2, 'LEN005', 'Lente Progresivo Premium', 'Progresivo de ultima generacion', 'PremiumOptic', 'Transparente', 140, 220, 5, 2),
(2, 'LEN006', 'Lente Polarizado', 'Para sol con proteccion UV400', 'SolarView', 'Gris', 52, 95, 12, 3),
(2, 'LEN007', 'Lente High Index 1.67', 'Delgado para graduaciones altas', 'ThinLens', 'Transparente', 85, 140, 7, 2),
(2, 'LEN008', 'Lente Asferico', 'Mas plano y liviano', 'OpticalLab', 'Transparente', 48, 90, 14, 4),
(2, 'LEN009', 'Lente Tintado', 'Tinte cosmico degradado', 'ColorTint', 'Marron', 54, 98, 9, 2),
(2, 'LEN010', 'Lente Queratocono', 'Diseno especial para queratocono', 'SpecialtyLens', 'Transparente', 120, 190, 4, 1);

-- Ventas (subtotal = suma de detalles; el recibo cuadra con cada venta)
INSERT INTO ventas (cliente_id, usuario_id, fecha, subtotal, total, metodo_pago) VALUES
(1, 3, '2026-07-03 10:30:00', 280, 280, 'EFECTIVO'),
(2, 1, '2026-07-09 16:20:00', 340, 340, 'QR'),
(3, 4, '2026-07-15 11:45:00', 590, 590, 'EFECTIVO'),
(4, 2, '2026-07-22 17:10:00', 310, 310, 'TARJETA'),
(5, 3, '2026-08-04 09:50:00', 460, 460, 'EFECTIVO'),
(6, 1, '2026-08-14 15:35:00', 325, 325, 'QR'),
(10, 4, '2026-08-21 12:15:00', 450, 450, 'EFECTIVO');

-- Detalle de venta (cantidad * precio_unitario = subtotal)
-- IDs: 1-10 = monturas (MON001-MON010), 11-20 = lentes (LEN001-LEN010)
INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 100, 100),
(1, 11, 2, 90, 180),
(2, 2, 1, 120, 120),
(2, 12, 2, 110, 220),
(3, 4, 1, 150, 150),
(3, 15, 2, 220, 440),
(4, 8, 1, 110, 110),
(4, 14, 2, 100, 200),
(5, 3, 1, 180, 180),
(5, 17, 2, 140, 280),
(6, 9, 1, 105, 105),
(6, 12, 2, 110, 220),
(7, 5, 1, 130, 130),
(7, 13, 2, 160, 320);

-- Órdenes de trabajo
INSERT INTO orden_trabajo
(cliente_id, receta_id, venta_id, fecha_ingreso, fecha_entrega, estado, observaciones)
VALUES
(1, 1, 1, '2026-07-03 10:35:00', '2026-07-10', 'ENTREGADO', 'Montaje de lentes monofocales'),
(2, 2, 2, '2026-07-09 16:25:00', '2026-07-16', 'ENTREGADO', 'Blue light con montura acetato'),
(3, 3, 3, '2026-07-15 11:50:00', '2026-07-25', 'LISTO PARA ENTREGA', 'Lentes progresivos premium'),
(4, 4, 4, '2026-07-22 17:15:00', '2026-07-29', 'ENTREGADO', 'Bifocales con montura vintage'),
(5, 5, 5, '2026-08-04 09:55:00', '2026-08-15', 'ENTREGADO', 'Alto indice 1.67 para miopia alta'),
(6, 6, 6, '2026-08-14 15:40:00', '2026-08-20', 'ENTREGADO', 'Blue light antifatiga'),
(10, NULL, 7, '2026-08-21 12:20:00', '2026-08-30', 'EN PROCESO', 'Fotocromaticos en laboratorio');

-- Recibos (monto_pagado + saldo = total de la venta)
INSERT INTO recibos
(venta_id, numero_recibo, fecha_emision, monto_pagado, saldo, fecha_entrega, observaciones)
VALUES
(1, 'REC-0001', '2026-07-03 10:30:00', 280, 0, '2026-07-10 12:00:00', 'Pago completo'),
(2, 'REC-0002', '2026-07-09 16:20:00', 340, 0, '2026-07-16 11:00:00', 'Pago completo'),
(3, 'REC-0003', '2026-07-15 11:45:00', 300, 290, '2026-07-25 10:00:00', 'Pago parcial - saldo pendiente'),
(4, 'REC-0004', '2026-07-22 17:10:00', 310, 0, '2026-07-29 14:00:00', 'Pago completo'),
(5, 'REC-0005', '2026-08-04 09:50:00', 250, 210, '2026-08-15 09:00:00', 'Pago parcial - saldo pendiente'),
(6, 'REC-0006', '2026-08-14 15:35:00', 325, 0, '2026-08-20 16:00:00', 'Pago completo'),
(7, 'REC-0007', '2026-08-21 12:15:00', 200, 250, '2026-08-30 11:00:00', 'Pago parcial - saldo pendiente');
