# 📄 Especificación Exhaustiva de Contratos de API (3_api_spec.md)
**Proyecto:** Sistema de Gestión Hotelera y Restaurante (`Hotel`)  
**Estilo:** RESTful API sobre HTTP/1.1 y HTTP/2  
**Formato de Intercambio:** `application/json`  
**Convención de Nomenclatura JSON:** `camelCase`  
**Versión:** 1.0.0  
**Fecha:** Octubre 2026  

---

## 1. Convención Global de Manejo de Errores

Todas las respuestas de error del sistema retornan una estructura JSON uniforme gestionada por el componente transversal `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-10-13T22:00:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Mensaje descriptivo del error o regla de negocio quebrantada",
  "path": "/api/recurso",
  "validationErrors": [
    "Campo 'nombre': El nombre del hotel es obligatorio"
  ]
}
```

### Matriz de Códigos de Estado HTTP
- **`200 OK`**: Petición procesada con éxito retornando datos.
- **`201 Created`**: Recurso creado exitosamente con identificador asignado.
- **`204 No Content`**: Eliminación ejecutada con éxito.
- **`400 Bad Request`**: Parámetros inválidos, incoherencia de fechas o violación de reglas de negocio.
- **`401 Unauthorized` / `403 Forbidden`**: Sin credenciales válidas o privilegios insuficientes.
- **`404 Not Found`**: El recurso con el identificador solicitado no existe en la persistencia.
- **`422 Unprocessable Entity`**: Error de validación de esquemas (anotaciones `@Valid`, campos nulos o con formatos inválidos).
- **`500 Internal Server Error`**: Falla inesperada no controlada en el servidor.

---

## 2. Endpoints CRUD del Modelo Operativo

---

### 2.1. Gestión de Hoteles (`/api/hoteles`)

#### `GET /api/hoteles`
- **Descripción:** Obtiene la lista completa de sedes hoteleras registradas.
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "nombre": "Hotel Gran Caldas",
    "direccion": "Carrera 23 # 54-10, Manizales",
    "telefono": "6068870000",
    "correo": "contacto@hotelgrancaldas.com",
    "activo": true
  }
]
```

#### `GET /api/hoteles/{id}`
- **Descripción:** Consulta el detalle de un hotel por su identificador primario.
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "id": 1,
  "nombre": "Hotel Gran Caldas",
  "direccion": "Carrera 23 # 54-10, Manizales",
  "telefono": "6068870000",
  "correo": "contacto@hotelgrancaldas.com",
  "activo": true
}
```
- **Error (`404 Not Found`):**
```json
{
  "timestamp": "2026-10-13T22:00:00",
  "status": 404,
  "error": "RESOURCE_NOT_FOUND",
  "message": "Recurso 'Hotel' con identificador [999] no encontrado",
  "path": "/api/hoteles/999",
  "validationErrors": null
}
```

#### `POST /api/hoteles`
- **Descripción:** Registra una nueva sede hotelera.
- **Payload de Entrada (JSON):**
```json
{
  "nombre": "Hotel Nevado Real",
  "direccion": "Avenida Santander # 65-20, Manizales",
  "telefono": "6068891122",
  "correo": "reservas@hotelnevadoreal.com",
  "activo": true
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 2,
  "nombre": "Hotel Nevado Real",
  "direccion": "Avenida Santander # 65-20, Manizales",
  "telefono": "6068891122",
  "correo": "reservas@hotelnevadoreal.com",
  "activo": true
}
```
- **Error de Validación (`400 Bad Request` / `422 Unprocessable Entity`):**
```json
{
  "timestamp": "2026-10-13T22:00:00",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Error en la validación de los datos suministrados",
  "path": "/api/hoteles",
  "validationErrors": [
    "Campo 'nombre': El nombre del hotel es obligatorio"
  ]
}
```

#### `PUT /api/hoteles/{id}`
- **Descripción:** Actualiza los atributos de un hotel existente.
- **Payload de Entrada (JSON):**
```json
{
  "nombre": "Hotel Gran Caldas Plaza",
  "direccion": "Carrera 23 # 54-10, Manizales",
  "telefono": "6068870001",
  "correo": "gerencia@hotelgrancaldas.com",
  "activo": true
}
```
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "id": 1,
  "nombre": "Hotel Gran Caldas Plaza",
  "direccion": "Carrera 23 # 54-10, Manizales",
  "telefono": "6068870001",
  "correo": "gerencia@hotelgrancaldas.com",
  "activo": true
}
```

#### `DELETE /api/hoteles/{id}`
- **Descripción:** Elimina una sede hotelera por su identificador.
- **Respuesta Exitosa (`204 No Content`):** Vacío.

---

### 2.2. Gestión de Restaurantes (`/api/restaurantes`)

#### `GET /api/restaurantes`
- **Query Params Opcionales:** `hotelId` (filtrar por sede hotelera).
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "hotelId": 1,
    "hotelNombre": "Hotel Gran Caldas",
    "nombre": "Restaurante El Paisaje Cultural",
    "descripcion": "Especialidades gastronómicas colombianas y de la región cafetera",
    "activo": true
  }
]
```

#### `POST /api/restaurantes`
- **Payload de Entrada (JSON):**
```json
{
  "hotelId": 1,
  "nombre": "Café Bistro Cordillera",
  "descripcion": "Repostería artesanal y café de origen caldense",
  "activo": true
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 2,
  "hotelId": 1,
  "hotelNombre": "Hotel Gran Caldas",
  "nombre": "Café Bistro Cordillera",
  "descripcion": "Repostería artesanal y café de origen caldense",
  "activo": true
}
```

---

### 2.3. Gestión de Habitaciones (`/api/habitaciones`)

#### `GET /api/habitaciones`
- **Query Params Opcionales:** `hotelId` (filtrar por hotel).
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "hotelId": 1,
    "hotelNombre": "Hotel Gran Caldas",
    "numero": "101",
    "tipo": "Sencilla",
    "capacidad": 1,
    "tarifaNoche": 120000.00,
    "estado": "DISPONIBLE"
  }
]
```

#### `POST /api/habitaciones`
- **Payload de Entrada (JSON):**
```json
{
  "hotelId": 1,
  "numero": "202",
  "tipo": "Doble Superior",
  "capacidad": 2,
  "tarifaNoche": 210000.00,
  "estado": "DISPONIBLE"
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 4,
  "hotelId": 1,
  "hotelNombre": "Hotel Gran Caldas",
  "numero": "202",
  "tipo": "Doble Superior",
  "capacidad": 2,
  "tarifaNoche": 210000.00,
  "estado": "DISPONIBLE"
}
```

---

### 2.4. Gestión de Clientes (`/api/clientes`)

#### `GET /api/clientes`
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "tipoDocumento": "CC",
    "numeroDocumento": "10538001",
    "nombres": "Carlos Alberto",
    "apellidos": "Gómez Muñoz",
    "correo": "carlos.gomez@gmail.com",
    "telefono": "3104501122"
  }
]
```

#### `POST /api/clientes`
- **Payload de Entrada (JSON):**
```json
{
  "tipoDocumento": "CC",
  "numeroDocumento": "10538099",
  "nombres": "Andrés Felipe",
  "apellidos": "Mejía Castro",
  "correo": "andres.mejia@gmail.com",
  "telefono": "3117890044"
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 5,
  "tipoDocumento": "CC",
  "numeroDocumento": "10538099",
  "nombres": "Andrés Felipe",
  "apellidos": "Mejía Castro",
  "correo": "andres.mejia@gmail.com",
  "telefono": "3117890044"
}
```

---

### 2.5. Catálogo de Tipos de Plato (`/api/tipos-plato`)

#### `GET /api/tipos-plato`
- **Query Params Opcionales:** `restauranteId`.
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "restauranteId": 1,
    "restauranteNombre": "Restaurante El Paisaje Cultural",
    "nombre": "Bandeja Paisa",
    "descripcion": "Frijoles, arroz, carne molida, chicharrón, huevo, tajada, arepa y aguacate",
    "precioBase": 38000.00,
    "activo": true
  }
]
```

#### `POST /api/tipos-plato`
- **Payload de Entrada (JSON):**
```json
{
  "restauranteId": 1,
  "nombre": "Mondongo Tradicional",
  "descripcion": "Sopa típica con verduras y carnes picadas",
  "precioBase": 30000.00,
  "activo": true
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 5,
  "restauranteId": 1,
  "restauranteNombre": "Restaurante El Paisaje Cultural",
  "nombre": "Mondongo Tradicional",
  "descripcion": "Sopa típica con verduras y carnes picadas",
  "precioBase": 30000.00,
  "activo": true
}
```

---

### 2.6. Gestión de Reservas (`/api/reservas`)

#### `GET /api/reservas`
- **Query Params Opcionales:** `clienteId`, `habitacionId`.
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "clienteId": 1,
    "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
    "habitacionId": 1,
    "habitacionNumero": "101",
    "fechaReserva": "2026-09-25",
    "fechaInicio": "2026-10-01",
    "fechaFin": "2026-10-05",
    "estado": "FINALIZADA",
    "totalHospedaje": 480000.00
  }
]
```

#### `POST /api/reservas`
- **Payload de Entrada (JSON):**
```json
{
  "clienteId": 1,
  "habitacionId": 1,
  "fechaReserva": "2026-10-14",
  "fechaInicio": "2026-10-20",
  "fechaFin": "2026-10-23",
  "estado": "CONFIRMADA",
  "totalHospedaje": 360000.00
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 4,
  "clienteId": 1,
  "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
  "habitacionId": 1,
  "habitacionNumero": "101",
  "fechaReserva": "2026-10-14",
  "fechaInicio": "2026-10-20",
  "fechaFin": "2026-10-23",
  "estado": "CONFIRMADA",
  "totalHospedaje": 360000.00
}
```
- **Error Lógico de Negocio (`400 Bad Request`):**
```json
{
  "timestamp": "2026-10-13T22:00:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "La fecha de fin no puede ser anterior a la fecha de inicio",
  "path": "/api/reservas",
  "validationErrors": null
}
```

---

### 2.7. Registro de Platos Comprados (`/api/platos-comprados`)

#### `GET /api/platos-comprados`
- **Query Params Opcionales:** `clienteId`, `tipoPlatoId`.
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "clienteId": 1,
    "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
    "tipoPlatoId": 1,
    "tipoPlatoNombre": "Bandeja Paisa",
    "fechaCompra": "2026-10-02 13:00:00",
    "cantidad": 1,
    "valorUnitario": 38000.00,
    "valorTotal": 38000.00
  }
]
```

#### `POST /api/platos-comprados`
- **Payload de Entrada (JSON):**
```json
{
  "clienteId": 1,
  "tipoPlatoId": 2,
  "cantidad": 2,
  "valorUnitario": 32000.00,
  "fechaCompra": "2026-10-14 12:45:00"
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "id": 7,
  "clienteId": 1,
  "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
  "tipoPlatoId": 2,
  "tipoPlatoNombre": "Ajiaco",
  "fechaCompra": "2026-10-14 12:45:00",
  "cantidad": 2,
  "valorUnitario": 32000.00,
  "valorTotal": 64000.00
}
```

---

## 3. Especificación de los 10 Reportes Analíticos de Negocio

Base path: `/api/reportes`

---

### 3.1. Reporte 1: Suma (nivel intermedio)
- **Definición de Ruta:** `GET /api/reportes/suma/habitacion-periodo`
- **Query Parameters Obligatorios:**
  - `habitacionId` (`Long`): Identificador único de la habitación.
  - `fechaInicio` (`LocalDate`, ISO: `YYYY-MM-DD`): Inicio del periodo de hospedaje.
  - `fechaFin` (`LocalDate`, ISO: `YYYY-MM-DD`): Fin del periodo de hospedaje.
- **Ejemplo de Petición:** `GET /api/reportes/suma/habitacion-periodo?habitacionId=1&fechaInicio=2026-10-01&fechaFin=2026-10-05`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "reporte": "Suma Intermedia",
  "descripcion": "Total compras de platos por clientes hospedados en hab. 101 entre 2026-10-01 y 2026-10-05",
  "total": 70000.00
}
```

---

### 3.2. Reporte 2: Suma (nivel fácil)
- **Definición de Ruta:** `GET /api/reportes/suma/cliente/{clienteId}`
- **Ejemplo de Petición:** `GET /api/reportes/suma/cliente/1`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "reporte": "Suma Fácil",
  "descripcion": "Total pagado en platos por cliente Carlos Alberto Gómez Muñoz (Doc: 10538001)",
  "total": 70000.00
}
```

---

### 3.3. Reporte 3: Conteo (nivel intermedio)
- **Definición de Ruta:** `GET /api/reportes/conteo/habitacion/{habitacionId}`
- **Ejemplo de Petición:** `GET /api/reportes/conteo/habitacion/1`
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "clienteId": 1,
    "numeroDocumento": "10538001",
    "nombreCompleto": "Carlos Alberto Gómez Muñoz",
    "totalPlatosComprados": 2
  },
  {
    "clienteId": 2,
    "numeroDocumento": "10538002",
    "nombreCompleto": "María Fernanda Rodríguez Ospina",
    "totalPlatosComprados": 3
  }
]
```

---

### 3.4. Reporte 4: Conteo (nivel fácil)
- **Definición de Ruta:** `GET /api/reportes/conteo/cliente/{clienteId}`
- **Ejemplo de Petición:** `GET /api/reportes/conteo/cliente/1`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "reporte": "Conteo Fácil",
  "descripcion": "Cantidad de platos comprados por cliente Carlos Alberto Gómez Muñoz",
  "cantidad": 2
}
```

---

### 3.5. Reporte 5: Promedio (nivel intermedio)
- **Definición de Ruta:** `GET /api/reportes/promedio/clientes-con-reserva`
- **Ejemplo de Petición:** `GET /api/reportes/promedio/clientes-con-reserva`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "reporte": "Promedio Intermedio",
  "descripcion": "Promedio del valor total de compras de platos por comensales que tienen reservas en el hotel",
  "promedio": 44000.0
}
```

---

### 3.6. Reporte 6: Promedio (nivel fácil)
- **Definición de Ruta:** `GET /api/reportes/promedio/cliente/{clienteId}`
- **Ejemplo de Petición:** `GET /api/reportes/promedio/cliente/1`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "reporte": "Promedio Fácil",
  "descripcion": "Promedio del valor de platos comprados por cliente Carlos Alberto Gómez Muñoz",
  "promedio": 35000.0
}
```

---

### 3.7. Reporte 7: Máximo o mínimo (nivel intermedio)
- **Definición de Ruta:** `GET /api/reportes/extremo/mayor-valor/habitacion/{habitacionId}`
- **Ejemplo de Petición:** `GET /api/reportes/extremo/mayor-valor/habitacion/1`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "clasificacion": "MAYOR_VALOR",
  "platoCompradoId": 4,
  "tipoPlatoId": 4,
  "nombrePlato": "Trucha al Ajillo",
  "valorUnitario": 42000.00,
  "valorTotal": 42000.00,
  "clienteId": 2,
  "clienteNombre": "María Fernanda Rodríguez Ospina",
  "fechaCompra": "2026-10-08 20:00:00"
}
```

---

### 3.8. Reporte 8: Máximo o mínimo (nivel fácil)
- **Definición de Ruta:** `GET /api/reportes/extremo/menor-valor/cliente/{clienteId}`
- **Ejemplo de Petición:** `GET /api/reportes/extremo/menor-valor/cliente/1`
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "clasificacion": "MENOR_VALOR",
  "platoCompradoId": 2,
  "tipoPlatoId": 2,
  "nombrePlato": "Ajiaco",
  "valorUnitario": 32000.00,
  "valorTotal": 32000.00,
  "clienteId": 1,
  "clienteNombre": "Carlos Alberto Gómez Muñoz",
  "fechaCompra": "2026-10-03 19:30:00"
}
```

---

### 3.9. Reporte 9: Búsqueda (nivel intermedio)
- **Definición de Ruta:** `GET /api/reportes/busqueda/tipo-plato-y-reserva`
- **Query Parameters Obligatorios:** `tipoPlatoId` (`Long`).
- **Ejemplo de Petición:** `GET /api/reportes/busqueda/tipo-plato-y-reserva?tipoPlatoId=1`
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "tipoDocumento": "CC",
    "numeroDocumento": "10538001",
    "nombres": "Carlos Alberto",
    "apellidos": "Gómez Muñoz",
    "correo": "carlos.gomez@gmail.com",
    "telefono": "3104501122"
  },
  {
    "id": 3,
    "tipoDocumento": "CC",
    "numeroDocumento": "10538003",
    "nombres": "Juan Esteban",
    "apellidos": "Pérez Londoño",
    "correo": "juan.perez@gmail.com",
    "telefono": "3157705566"
  }
]
```

---

### 3.10. Reporte 10: Búsqueda (nivel fácil)
- **Definición de Ruta:** `GET /api/reportes/busqueda/platos-por-cliente/{clienteId}`
- **Ejemplo de Petición:** `GET /api/reportes/busqueda/platos-por-cliente/1`
- **Respuesta Exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "clienteId": 1,
    "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
    "tipoPlatoId": 1,
    "tipoPlatoNombre": "Bandeja Paisa",
    "fechaCompra": "2026-10-02 13:00:00",
    "cantidad": 1,
    "valorUnitario": 38000.00,
    "valorTotal": 38000.00
  },
  {
    "id": 2,
    "clienteId": 1,
    "clienteNombreCompleto": "Carlos Alberto Gómez Muñoz",
    "tipoPlatoId": 2,
    "tipoPlatoNombre": "Ajiaco",
    "fechaCompra": "2026-10-03 19:30:00",
    "cantidad": 1,
    "valorUnitario": 32000.00,
    "valorTotal": 32000.00
  }
]
```
