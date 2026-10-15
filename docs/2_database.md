# 🗄️ Documento de Base de Datos (2_database.md)
**Proyecto:** Sistema de Gestión Hotelera y Restaurante (`Hotel`)  
**Modelo de Persistencia:** Relacional (ANSI SQL / PostgreSQL 16+ / H2)  
**Versión del Esquema:** 1.0.0  
**Fecha:** Octubre 2026  

---

## 1. Script DDL Inmaculado

El siguiente script define el esquema físico relacional en tercera forma normal (3NF), respetando fielmente el diseño de entidades y relaciones establecido en el diagrama de especificación:

```sql
-- =============================================================================
-- ESQUEMA RELACIONAL: SISTEMA HOTEL Y RESTAURANTE
-- =============================================================================

-- 1. TABLA: hoteles
CREATE TABLE IF NOT EXISTS hoteles (
    hotel_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(30),
    correo VARCHAR(120) UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_hotel_nombre_no_vacio CHECK (length(trim(nombre)) > 0)
);

-- 2. TABLA: restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    restaurante_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_restaurantes_hotel FOREIGN KEY (hotel_id)
        REFERENCES hoteles (hotel_id) ON DELETE RESTRICT,
    CONSTRAINT chk_restaurante_nombre_no_vacio CHECK (length(trim(nombre)) > 0)
);

-- 3. TABLA: habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
    habitacion_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo VARCHAR(60) NOT NULL,
    capacidad INT NOT NULL,
    tarifa_noche NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',
    CONSTRAINT fk_habitaciones_hotel FOREIGN KEY (hotel_id)
        REFERENCES hoteles (hotel_id) ON DELETE RESTRICT,
    CONSTRAINT uq_habitaciones_hotel_numero UNIQUE (hotel_id, numero),
    CONSTRAINT chk_habitacion_capacidad_positiva CHECK (capacidad > 0),
    CONSTRAINT chk_habitacion_tarifa_positiva CHECK (tarifa_noche >= 0)
);

-- 4. TABLA: clientes
CREATE TABLE IF NOT EXISTS clientes (
    cliente_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(40) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(120),
    telefono VARCHAR(30),
    CONSTRAINT chk_cliente_documento_no_vacio CHECK (length(trim(numero_documento)) > 0),
    CONSTRAINT chk_cliente_nombres_no_vacio CHECK (length(trim(nombres)) > 0)
);

-- 5. TABLA: tipos_plato
CREATE TABLE IF NOT EXISTS tipos_plato (
    tipo_plato_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    restaurante_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio_base NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_tipos_plato_restaurante FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes (restaurante_id) ON DELETE RESTRICT,
    CONSTRAINT chk_tipo_plato_nombre_no_vacio CHECK (length(trim(nombre)) > 0),
    CONSTRAINT chk_tipo_plato_precio_base CHECK (precio_base >= 0)
);

-- 6. TABLA: reservas
CREATE TABLE IF NOT EXISTS reservas (
    reserva_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    habitacion_id BIGINT NOT NULL,
    fecha_reserva DATE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'CONFIRMADA',
    total_hospedaje NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_reservas_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes (cliente_id) ON DELETE RESTRICT,
    CONSTRAINT fk_reservas_habitacion FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones (habitacion_id) ON DELETE RESTRICT,
    CONSTRAINT chk_reserva_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_reserva_total CHECK (total_hospedaje >= 0)
);

-- 7. TABLA: platos_comprados
CREATE TABLE IF NOT EXISTS platos_comprados (
    plato_comprado_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    tipo_plato_id BIGINT NOT NULL,
    fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL DEFAULT 1,
    valor_unitario NUMERIC(12, 2) NOT NULL,
    valor_total NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_platos_comprados_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes (cliente_id) ON DELETE RESTRICT,
    CONSTRAINT fk_platos_comprados_tipo_plato FOREIGN KEY (tipo_plato_id)
        REFERENCES tipos_plato (tipo_plato_id) ON DELETE RESTRICT,
    CONSTRAINT chk_plato_compra_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_plato_compra_unitario CHECK (valor_unitario >= 0),
    CONSTRAINT chk_plato_compra_total CHECK (valor_total >= 0)
);

-- =============================================================================
-- ÍNDICES DE RENDIMIENTO PARA REPORTES ANALÍTICOS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_reservas_habitacion_fechas ON reservas (habitacion_id, fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON reservas (cliente_id);
CREATE INDEX IF NOT EXISTS idx_platos_comprados_cliente ON platos_comprados (cliente_id);
CREATE INDEX IF NOT EXISTS idx_platos_comprados_tipo_plato ON platos_comprados (tipo_plato_id);
CREATE INDEX IF NOT EXISTS idx_platos_comprados_fecha ON platos_comprados (fecha_compra);
```

---

## 2. Diccionario de Datos Exhaustivo

### 2.1. Entidad: `hoteles`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `hotel_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único secuencial del hotel. |
| `nombre` | `VARCHAR(120)` | `NOT NULL, CHECK (length > 0)` | Nombre comercial de la sede hotelera. |
| `direccion` | `VARCHAR(200)` | `NULL` | Ubicación geográfica física del hotel. |
| `telefono` | `VARCHAR(30)` | `NULL` | Teléfono de contacto institucional. |
| `correo` | `VARCHAR(120)` | `UNIQUE, NULL` | Correo electrónico oficial del hotel. |
| `activo` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Indicador de disponibilidad operativa de la sede. |

### 2.2. Entidad: `restaurantes`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `restaurante_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único secuencial del restaurante. |
| `hotel_id` | `BIGINT` | `FK -> hoteles(hotel_id), NOT NULL, ON DELETE RESTRICT` | Hotel al que pertenece el restaurante (relación 1:1 o 1:N). |
| `nombre` | `VARCHAR(120)` | `NOT NULL, CHECK (length > 0)` | Nombre del establecimiento gastronómico. |
| `descripcion` | `VARCHAR(255)` | `NULL` | Descripción de la oferta culinaria. |
| `activo` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Indica si el restaurante está brindando servicio. |

### 2.3. Entidad: `habitaciones`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `habitacion_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único secuencial de la habitación. |
| `hotel_id` | `BIGINT` | `FK -> hoteles(hotel_id), NOT NULL, ON DELETE RESTRICT` | Sede hotelera donde se ubica la habitación. |
| `numero` | `VARCHAR(20)` | `NOT NULL, UNIQUE(hotel_id, numero)` | Número o código identificador de la habitación. |
| `tipo` | `VARCHAR(60)` | `NOT NULL` | Tipo de habitación (Ej. 'Sencilla', 'Doble', 'Suite Presidencial'). |
| `capacidad` | `INT` | `NOT NULL, CHECK (capacidad > 0)` | Capacidad máxima de ocupantes permitidos. |
| `tarifa_noche` | `NUMERIC(12, 2)` | `NOT NULL, CHECK (tarifa_noche >= 0)` | Precio por noche de hospedaje en pesos colombianos o moneda local. |
| `estado` | `VARCHAR(30)` | `NOT NULL, DEFAULT 'DISPONIBLE'` | Estado físico: 'DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO'. |

### 2.4. Entidad: `clientes`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `cliente_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único secuencial del cliente. |
| `tipo_documento` | `VARCHAR(20)` | `NOT NULL` | Tipo de documento de identidad ('CC', 'CE', 'PASAPORTE'). |
| `numero_documento`| `VARCHAR(40)` | `NOT NULL, UNIQUE` | Documento de identificación legal único del huésped. |
| `nombres` | `VARCHAR(100)` | `NOT NULL` | Nombres de pila del cliente. |
| `apellidos` | `VARCHAR(100)` | `NOT NULL` | Apellidos del cliente. |
| `correo` | `VARCHAR(120)` | `NULL` | Correo electrónico personal para contacto y notificaciones. |
| `telefono` | `VARCHAR(30)` | `NULL` | Línea telefónica o celular del cliente. |

### 2.5. Entidad: `tipos_plato`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `tipo_plato_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único del plato o especialidad gastronómica. |
| `restaurante_id` | `BIGINT` | `FK -> restaurantes(restaurante_id), NOT NULL, ON DELETE RESTRICT` | Restaurante que ofrece el plato. |
| `nombre` | `VARCHAR(100)` | `NOT NULL` | Nombre del plato (Ej: 'Bandeja Paisa', 'Ajiaco', 'Sancocho'). |
| `descripcion` | `VARCHAR(255)` | `NULL` | Ingredientes o detalles del plato. |
| `precio_base` | `NUMERIC(12, 2)` | `NOT NULL, DEFAULT 0.00` | Precio sugerido estándar del plato. |
| `activo` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Disponibilidad actual en la carta. |

### 2.6. Entidad: `reservas`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `reserva_id` | `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único de la reserva de habitación. |
| `cliente_id` | `BIGINT` | `FK -> clientes(cliente_id), NOT NULL, ON DELETE RESTRICT` | Huésped que realiza y titulariza la reserva. |
| `habitacion_id` | `BIGINT` | `FK -> habitaciones(habitacion_id), NOT NULL, ON DELETE RESTRICT` | Habitación asignada para la estancia. |
| `fecha_reserva` | `DATE` | `NOT NULL` | Fecha en la que se generó la solicitud de reserva. |
| `fecha_inicio` | `DATE` | `NOT NULL` | Fecha de check-in / inicio de estancia. |
| `fecha_fin` | `DATE` | `NOT NULL, CHECK (fecha_fin >= fecha_inicio)` | Fecha de check-out / fin de estancia. |
| `estado` | `VARCHAR(30)` | `NOT NULL, DEFAULT 'CONFIRMADA'` | Estado del ciclo: 'CONFIRMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'. |
| `total_hospedaje` | `NUMERIC(12, 2)` | `NOT NULL, CHECK (total_hospedaje >= 0)` | Monto total facturado por la estancia del huésped. |

### 2.7. Entidad: `platos_comprados`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `plato_comprado_id`| `BIGINT` | `PK, NOT NULL, IDENTITY` | Identificador único de la transacción de compra en restaurante. |
| `cliente_id` | `BIGINT` | `FK -> clientes(cliente_id), NOT NULL, ON DELETE RESTRICT` | Huésped o comensal que realiza la compra. |
| `tipo_plato_id` | `BIGINT` | `FK -> tipos_plato(tipo_plato_id), NOT NULL, ON DELETE RESTRICT` | Plato o producto consumido. |
| `fecha_compra` | `TIMESTAMP` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Fecha y hora exacta de la compra. |
| `cantidad` | `INT` | `NOT NULL, DEFAULT 1, CHECK (cantidad > 0)` | Número de raciones adquiridas. |
| `valor_unitario` | `NUMERIC(12, 2)` | `NOT NULL, CHECK (valor_unitario >= 0)` | Precio unitario cobrado al momento de la transacción. |
| `valor_total` | `NUMERIC(12, 2)` | `NOT NULL, CHECK (valor_total >= 0)` | Importe total liquidado (`cantidad * valor_unitario`). |
