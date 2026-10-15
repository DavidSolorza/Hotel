# Sistema de Gestion Hotelera y Restaurante (Hotel)

Solucion integral compuesta por:
- **Backend (`back/`):** Desarrollado en Java 21/25 con Spring Boot 3.4.3, disenado bajo el patron didactico de Arquitectura en Capas (Layered Architecture) segun los lineamientos de la Universidad de Caldas.
- **Frontend (`front/`):** Aplicacion web minimalista desarrollada en React 19 con Vite y Tailwind CSS, disenada sin emojis, con tipografia Inter, iconos vectoriales y soporte para ejecucion y visualizacion de los 10 reportes analiticos.

---

## Estructura del Proyecto

```
Hotel/
├── back/                        # Backend Spring Boot en Capas
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── src/
│   │   ├── main/java/com/hotel/
│   │   │   ├── HotelApplication.java
│   │   │   ├── core/            # Config, WebConfig (CORS), Errors y NativeHttpClient
│   │   │   ├── models/          # Entidades JPA (Hotel, Habitacion, Cliente, etc.)
│   │   │   ├── dataaccess/      # Repositorios JPA y consultas analiticas
│   │   │   ├── business/        # Servicios de negocio y ReporteService (10 reportes)
│   │   │   └── presentation/    # Controladores REST y DTOs
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql         # Datos precargados de prueba
│   └── test/                    # Suite de 11 pruebas de reportes
├── front/                       # Frontend Web Minimalista
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── services/            # Cliente API con deteccion de conexion y mock fallback
│       ├── components/          # Vistas (Dashboard, 10 Reportes, Habitaciones, etc.)
│       └── App.jsx
└── docs/                        # Documentacion Tecnica de Ingenieria
    ├── 1_architecture.md        # Diagrama de arquitectura y ADRs
    ├── 2_database.md            # Script DDL 3NF y diccionario de datos
    └── 3_api_spec.md            # Contratos de endpoints REST
```

---

## Instrucciones de Ejecucion

### 1. Iniciar el Backend (Spring Boot)
Abre una terminal y ejecuta:
```powershell
cd back
.\mvnw.cmd spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Consola H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:hoteldb`, Usuario: `sa`, Contrasena: vacia)

Para ejecutar las pruebas del backend:
```powershell
cd back
.\mvnw.cmd test
```

### 2. Iniciar el Frontend (React + Vite + Tailwind CSS)
Abre otra terminal y ejecuta:
```powershell
cd front
npm run dev
```
La aplicacion estara disponible en `http://localhost:3000` (o el puerto indicado por Vite).

---

## Matriz de los 10 Reportes Implementados

| # | Categoria | Nivel | Metodo | Endpoint en Backend | Descripcion |
|---|---|---|---|---|---|
| **1** | Suma | Intermedio | `GET` | `/api/reportes/suma/habitacion-periodo` | Total compras de platos por clientes de una habitacion en un periodo |
| **2** | Suma | Facil | `GET` | `/api/reportes/suma/cliente/{clienteId}` | Total pagado en platos por un cliente seleccionado |
| **3** | Conteo | Intermedio | `GET` | `/api/reportes/conteo/habitacion/{habitacionId}` | Platos comprados por cada cliente que reservo en una habitacion |
| **4** | Conteo | Facil | `GET` | `/api/reportes/conteo/cliente/{clienteId}` | Cantidad total de platos comprados por un cliente |
| **5** | Promedio | Intermedio | `GET` | `/api/reportes/promedio/clientes-con-reserva` | Promedio compras de clientes que reservaron en el hotel |
| **6** | Promedio | Facil | `GET` | `/api/reportes/promedio/cliente/{clienteId}` | Promedio valor platos comprados por un cliente |
| **7** | Max/Min | Intermedio | `GET` | `/api/reportes/extremo/mayor-valor/habitacion/{habitacionId}` | Plato de mayor valor comprado por clientes en una habitacion |
| **8** | Max/Min | Facil | `GET` | `/api/reportes/extremo/menor-valor/cliente/{clienteId}` | Plato de menor valor entre compras de un cliente |
| **9** | Busqueda | Intermedio | `GET` | `/api/reportes/busqueda/tipo-plato-y-reserva` | Clientes que compraron tipo de plato X y reservaron en el hotel |
| **10** | Busqueda | Facil | `GET` | `/api/reportes/busqueda/platos-por-cliente/{clienteId}` | Lista de platos comprados por un cliente |

---

## Documentacion Tecnica Detallada
- [1_architecture.md](file:///c:/Users/Usuario/Desktop/Hotel/docs/1_architecture.md): Diagrama de componentes y ADRs.
- [2_database.md](file:///c:/Users/Usuario/Desktop/Hotel/docs/2_database.md): Script DDL normalizado e indices.
- [3_api_spec.md](file:///c:/Users/Usuario/Desktop/Hotel/docs/3_api_spec.md): Especificacion exhaustiva de payloads y codigos HTTP.
