-- =============================================================================
-- DATOS INICIALES DE PRUEBA: SISTEMA HOTEL Y RESTAURANTE
-- =============================================================================

-- 1. Hotel
INSERT INTO hoteles (hotel_id, nombre, direccion, telefono, correo, activo)
VALUES (1, 'Hotel Gran Caldas', 'Carrera 23 # 54-10, Manizales', '6068870000', 'contacto@hotelgrancaldas.com', true);

-- 2. Restaurante
INSERT INTO restaurantes (restaurante_id, hotel_id, nombre, descripcion, activo)
VALUES (1, 1, 'Restaurante El Paisaje Cultural', 'Especialidades gastronomicas colombianas y de la region cafetera', true);

-- 3. Habitaciones
INSERT INTO habitaciones (habitacion_id, hotel_id, numero, tipo, capacidad, tarifa_noche, estado)
VALUES 
(1, 1, '101', 'Sencilla', 1, 120000.00, 'DISPONIBLE'),
(2, 1, '102', 'Doble', 2, 180000.00, 'OCUPADA'),
(3, 1, '201', 'Suite', 4, 320000.00, 'DISPONIBLE');

-- 4. Clientes
INSERT INTO clientes (cliente_id, tipo_documento, numero_documento, nombres, apellidos, correo, telefono)
VALUES
(1, 'CC', '10538001', 'Carlos Alberto', 'Gomez Munoz', 'carlos.gomez@gmail.com', '3104501122'),
(2, 'CC', '10538002', 'Maria Fernanda', 'Rodriguez Ospina', 'maria.rodriguez@gmail.com', '3128903344'),
(3, 'CC', '10538003', 'Juan Esteban', 'Perez Londono', 'juan.perez@gmail.com', '3157705566'),
(4, 'CC', '10538004', 'Luisa Marcela', 'Sanchez Rios', 'luisa.sanchez@gmail.com', '3183307788');

-- 5. Tipos de Plato
INSERT INTO tipos_plato (tipo_plato_id, restaurante_id, nombre, descripcion, precio_base, activo)
VALUES
(1, 1, 'Bandeja Paisa', 'Frijoles, arroz, carne molida, chicharron, huevo, tajada, arepa y aguacate', 38000.00, true),
(2, 1, 'Ajiaco', 'Sopa tradicional bogotana con pollo, tres tipos de papa, guascas, crema y alcaparras', 32000.00, true),
(3, 1, 'Sancocho', 'Sancocho trifasico de res, cerdo y pollo con yuca, platano y mazorca', 35000.00, true),
(4, 1, 'Trucha al Ajillo', 'Trucha fresca de la cordillera preparada al ajillo con patacon', 42000.00, true);

-- 6. Reservas
-- Carlos Gómez se hospedó en la habitación 101 del 2026-10-01 al 2026-10-05
INSERT INTO reservas (reserva_id, cliente_id, habitacion_id, fecha_reserva, fecha_inicio, fecha_fin, estado, total_hospedaje)
VALUES (1, 1, 1, '2026-09-25', '2026-10-01', '2026-10-05', 'FINALIZADA', 480000.00);

-- María Rodríguez se hospedó en la habitación 101 del 2026-10-06 al 2026-10-10
INSERT INTO reservas (reserva_id, cliente_id, habitacion_id, fecha_reserva, fecha_inicio, fecha_fin, estado, total_hospedaje)
VALUES (2, 2, 1, '2026-10-01', '2026-10-06', '2026-10-10', 'FINALIZADA', 480000.00);

-- Juan Pérez se hospedó en la habitación 102 del 2026-10-02 al 2026-10-08
INSERT INTO reservas (reserva_id, cliente_id, habitacion_id, fecha_reserva, fecha_inicio, fecha_fin, estado, total_hospedaje)
VALUES (3, 3, 2, '2026-09-28', '2026-10-02', '2026-10-08', 'CONFIRMADA', 1080000.00);

-- Luisa Sánchez no tiene reservas (sirve para probar filtros de clientes sin reserva)

-- 7. Platos Comprados
-- Carlos Gómez compra Bandeja Paisa y Ajiaco
INSERT INTO platos_comprados (plato_comprado_id, cliente_id, tipo_plato_id, fecha_compra, cantidad, valor_unitario, valor_total)
VALUES
(1, 1, 1, '2026-10-02 13:00:00', 1, 38000.00, 38000.00),
(2, 1, 2, '2026-10-03 19:30:00', 1, 32000.00, 32000.00);

-- María Rodríguez compra Sancocho y Trucha al Ajillo
INSERT INTO platos_comprados (plato_comprado_id, cliente_id, tipo_plato_id, fecha_compra, cantidad, valor_unitario, valor_total)
VALUES
(3, 2, 3, '2026-10-07 13:15:00', 2, 35000.00, 70000.00),
(4, 2, 4, '2026-10-08 20:00:00', 1, 42000.00, 42000.00);

-- Juan Pérez compra Bandeja Paisa
INSERT INTO platos_comprados (plato_comprado_id, cliente_id, tipo_plato_id, fecha_compra, cantidad, valor_unitario, valor_total)
VALUES
(5, 3, 1, '2026-10-03 14:00:00', 1, 38000.00, 38000.00);

-- Luisa Sánchez compra Sancocho (sin hospedaje)
INSERT INTO platos_comprados (plato_comprado_id, cliente_id, tipo_plato_id, fecha_compra, cantidad, valor_unitario, valor_total)
VALUES
(6, 4, 3, '2026-10-05 12:30:00', 1, 35000.00, 35000.00);
