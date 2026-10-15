// Datos iniciales identicos a data.sql para visualizacion fluida y testing
export const INITIAL_DATA = {
  hotel: {
    id: 1,
    nombre: "Hotel Gran Caldas",
    direccion: "Carrera 23 # 54-10, Manizales",
    telefono: "6068870000",
    correo: "contacto@hotelgrancaldas.com",
    activo: true,
  },
  restaurante: {
    id: 1,
    nombre: "Restaurante El Paisaje Cultural",
    descripcion: "Especialidades gastronomicas colombianas y de la region cafetera",
    activo: true,
  },
  habitaciones: [
    { id: 1, hotelId: 1, numero: "101", tipo: "Sencilla", capacidad: 1, tarifaNoche: 120000.00, estado: "DISPONIBLE" },
    { id: 2, hotelId: 1, numero: "102", tipo: "Doble", capacidad: 2, tarifaNoche: 180000.00, estado: "OCUPADA" },
    { id: 3, hotelId: 1, numero: "201", tipo: "Suite", capacidad: 4, tarifaNoche: 320000.00, estado: "DISPONIBLE" },
  ],
  clientes: [
    { id: 1, tipoDocumento: "CC", numeroDocumento: "10538001", nombres: "Carlos Alberto", apellidos: "Gomez Munoz", correo: "carlos.gomez@gmail.com", telefono: "3104501122" },
    { id: 2, tipoDocumento: "CC", numeroDocumento: "10538002", nombres: "Maria Fernanda", apellidos: "Rodriguez Ospina", correo: "maria.rodriguez@gmail.com", telefono: "3128903344" },
    { id: 3, tipoDocumento: "CC", numeroDocumento: "10538003", nombres: "Juan Esteban", apellidos: "Perez Londono", correo: "juan.perez@gmail.com", telefono: "3157705566" },
    { id: 4, tipoDocumento: "CC", numeroDocumento: "10538004", nombres: "Luisa Marcela", apellidos: "Sanchez Rios", correo: "luisa.sanchez@gmail.com", telefono: "3183307788" },
  ],
  tiposPlato: [
    { id: 1, restauranteId: 1, nombre: "Bandeja Paisa", descripcion: "Frijoles, arroz, carne molida, chicharron, huevo, tajada, arepa y aguacate", precioBase: 38000.00, activo: true },
    { id: 2, restauranteId: 1, nombre: "Ajiaco", descripcion: "Sopa tradicional bogotana con pollo, tres tipos de papa, guascas, crema y alcaparras", precioBase: 32000.00, activo: true },
    { id: 3, restauranteId: 1, nombre: "Sancocho", descripcion: "Sancocho trifasico de res, cerdo y pollo con yuca, platano y mazorca", precioBase: 35000.00, activo: true },
    { id: 4, restauranteId: 1, nombre: "Trucha al Ajillo", descripcion: "Trucha fresca de la cordillera preparada al ajillo con patacon", precioBase: 42000.00, activo: true },
  ],
  reservas: [
    { id: 1, clienteId: 1, habitacionId: 1, clienteNombre: "Carlos Alberto Gomez Munoz", habitacionNumero: "101", fechaReserva: "2026-09-25", fechaInicio: "2026-10-01", fechaFin: "2026-10-05", estado: "FINALIZADA", totalHospedaje: 480000.00 },
    { id: 2, clienteId: 2, habitacionId: 1, clienteNombre: "Maria Fernanda Rodriguez Ospina", habitacionNumero: "101", fechaReserva: "2026-10-01", fechaInicio: "2026-10-06", fechaFin: "2026-10-10", estado: "FINALIZADA", totalHospedaje: 480000.00 },
    { id: 3, clienteId: 3, habitacionId: 2, clienteNombre: "Juan Esteban Perez Londono", habitacionNumero: "102", fechaReserva: "2026-09-28", fechaInicio: "2026-10-02", fechaFin: "2026-10-08", estado: "CONFIRMADA", totalHospedaje: 1080000.00 },
  ],
  platosComprados: [
    { id: 1, clienteId: 1, tipoPlatoId: 1, platoNombre: "Bandeja Paisa", clienteNombre: "Carlos Alberto Gomez Munoz", fechaCompra: "2026-10-02 13:00", cantidad: 1, valorUnitario: 38000.00, valorTotal: 38000.00 },
    { id: 2, clienteId: 1, tipoPlatoId: 2, platoNombre: "Ajiaco", clienteNombre: "Carlos Alberto Gomez Munoz", fechaCompra: "2026-10-03 19:30", cantidad: 1, valorUnitario: 32000.00, valorTotal: 32000.00 },
    { id: 3, clienteId: 2, tipoPlatoId: 3, platoNombre: "Sancocho", clienteNombre: "Maria Fernanda Rodriguez Ospina", fechaCompra: "2026-10-07 13:15", cantidad: 2, valorUnitario: 35000.00, valorTotal: 70000.00 },
    { id: 4, clienteId: 2, tipoPlatoId: 4, platoNombre: "Trucha al Ajillo", clienteNombre: "Maria Fernanda Rodriguez Ospina", fechaCompra: "2026-10-08 20:00", cantidad: 1, valorUnitario: 42000.00, valorTotal: 42000.00 },
    { id: 5, clienteId: 3, tipoPlatoId: 1, platoNombre: "Bandeja Paisa", clienteNombre: "Juan Esteban Perez Londono", fechaCompra: "2026-10-03 14:00", cantidad: 1, valorUnitario: 38000.00, valorTotal: 38000.00 },
    { id: 6, clienteId: 4, tipoPlatoId: 3, platoNombre: "Sancocho", clienteNombre: "Luisa Marcela Sanchez Rios", fechaCompra: "2026-10-05 12:30", cantidad: 1, valorUnitario: 35000.00, valorTotal: 35000.00 },
  ],
};
