import { INITIAL_DATA } from './mockData';

const BASE_URL = 'http://localhost:8080/api';

/**
 * Cliente HTTP estructurado para comunicarse con la API REST de Spring Boot.
 * Si el backend no esta encendido, conmuta transparentemente a datos en memoria
 * para garantizar operatividad inmediata en cualquier entorno.
 */
class HotelApiClient {
  constructor() {
    this.useMock = false;
    this.memoryData = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  async fetchWithTimeout(resource, options = {}) {
    const { timeout = 2500 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // Comprobar estado de conectividad con el backend
  async checkBackendHealth() {
    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/hoteles`, { timeout: 1500 });
      if (res.ok) {
        this.useMock = false;
        return { online: true, message: 'Conectado a Spring Boot (localhost:8080)' };
      }
    } catch {
      // Backend no disponible
    }
    this.useMock = true;
    return { online: false, message: 'Modo Local Activo (Backend desconectado)' };
  }

  // Habitaciones
  async getHabitaciones() {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/habitaciones`);
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    return this.memoryData.habitaciones;
  }

  // Clientes
  async getClientes() {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/clientes`);
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    return this.memoryData.clientes;
  }

  // Reservas
  async getReservas() {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/reservas`);
        if (res.ok) {
          const list = await res.json();
          return list.map(r => ({
            ...r,
            clienteNombre: r.clienteNombre || r.clienteNombreCompleto,
            habitacionNumero: r.habitacionNumero || `${r.habitacionId}`
          }));
        }
      } catch {
        this.useMock = true;
      }
    }
    return this.memoryData.reservas;
  }

  // Tipos de Plato
  async getTiposPlato() {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/tipos-plato`);
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    return this.memoryData.tiposPlato;
  }

  // Platos Comprados
  async getPlatosComprados() {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/platos-comprados`);
        if (res.ok) {
          const list = await res.json();
          return list.map(pc => ({
            ...pc,
            platoNombre: pc.platoNombre || pc.tipoPlatoNombre,
            clienteNombre: pc.clienteNombre || pc.clienteNombreCompleto
          }));
        }
      } catch {
        this.useMock = true;
      }
    }
    return this.memoryData.platosComprados;
  }

  // Crear Reserva
  async createReserva(dto) {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/reservas`, {
          method: 'POST',
          body: JSON.stringify(dto),
        });
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    const newId = this.memoryData.reservas.length + 1;
    const cliente = this.memoryData.clientes.find(c => c.id === Number(dto.clienteId));
    const hab = this.memoryData.habitaciones.find(h => h.id === Number(dto.habitacionId));
    const noches = Math.max(1, Math.round((new Date(dto.fechaFin) - new Date(dto.fechaInicio)) / (1000 * 60 * 60 * 24)));
    const total = dto.totalHospedaje || (hab ? hab.tarifaNoche * noches : 120000);
    const newReserva = {
      id: newId,
      clienteId: Number(dto.clienteId),
      clienteNombre: cliente ? `${cliente.nombres} ${cliente.apellidos}` : `Cliente #${dto.clienteId}`,
      habitacionId: Number(dto.habitacionId),
      habitacionNumero: hab ? hab.numero : `${dto.habitacionId}`,
      fechaReserva: dto.fechaReserva || new Date().toISOString().split('T')[0],
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      estado: dto.estado || 'CONFIRMADA',
      totalHospedaje: total,
    };
    this.memoryData.reservas.unshift(newReserva);
    if (hab) {
      hab.estado = 'OCUPADA';
    }
    return newReserva;
  }

  // Crear Compra de Plato
  async createPlatoComprado(dto) {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/platos-comprados`, {
          method: 'POST',
          body: JSON.stringify(dto),
        });
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    const newId = this.memoryData.platosComprados.length + 1;
    const cliente = this.memoryData.clientes.find(c => c.id === Number(dto.clienteId));
    const tipo = this.memoryData.tiposPlato.find(tp => tp.id === Number(dto.tipoPlatoId));
    const cant = Number(dto.cantidad || 1);
    const unitario = Number(dto.valorUnitario || (tipo ? tipo.precioBase : 35000));
    const newCompra = {
      id: newId,
      clienteId: Number(dto.clienteId),
      clienteNombre: cliente ? `${cliente.nombres} ${cliente.apellidos}` : `Cliente #${dto.clienteId}`,
      tipoPlatoId: Number(dto.tipoPlatoId),
      platoNombre: tipo ? tipo.nombre : `Plato #${dto.tipoPlatoId}`,
      fechaCompra: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cantidad: cant,
      valorUnitario: unitario,
      valorTotal: unitario * cant,
    };
    this.memoryData.platosComprados.unshift(newCompra);
    return newCompra;
  }

  // Crear Cliente
  async createCliente(dto) {
    if (!this.useMock) {
      try {
        const res = await this.fetchWithTimeout(`${BASE_URL}/clientes`, {
          method: 'POST',
          body: JSON.stringify(dto),
        });
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }
    const newId = this.memoryData.clientes.length + 1;
    const newCliente = {
      id: newId,
      ...dto,
    };
    this.memoryData.clientes.push(newCliente);
    return newCliente;
  }

  // 10 Reportes de Negocio
  async getReporte(reportId, params = {}) {
    if (!this.useMock) {
      try {
        let url = `${BASE_URL}/reportes`;
        switch (reportId) {
          case 1:
            url += `/suma/habitacion-periodo?habitacionId=${params.habitacionId}&fechaInicio=${params.fechaInicio}&fechaFin=${params.fechaFin}`;
            break;
          case 2:
            url += `/suma/cliente/${params.clienteId}`;
            break;
          case 3:
            url += `/conteo/habitacion/${params.habitacionId}`;
            break;
          case 4:
            url += `/conteo/cliente/${params.clienteId}`;
            break;
          case 5:
            url += `/promedio/clientes-con-reserva`;
            break;
          case 6:
            url += `/promedio/cliente/${params.clienteId}`;
            break;
          case 7:
            url += `/extremo/mayor-valor/habitacion/${params.habitacionId}`;
            break;
          case 8:
            url += `/extremo/menor-valor/cliente/${params.clienteId}`;
            break;
          case 9:
            url += `/busqueda/tipo-plato-y-reserva?tipoPlatoId=${params.tipoPlatoId}`;
            break;
          case 10:
            url += `/busqueda/platos-por-cliente/${params.clienteId}`;
            break;
          default:
            throw new Error(`Reporte no reconocido: ${reportId}`);
        }

        const res = await this.fetchWithTimeout(url);
        if (res.ok) return await res.json();
      } catch {
        this.useMock = true;
      }
    }

    // Resolucion en memoria para fallback fluido
    return this.resolveMockReport(reportId, params);
  }

  resolveMockReport(reportId, params) {
    const { habitaciones, clientes, reservas, tiposPlato, platosComprados } = this.memoryData;

    switch (reportId) {
      case 1: { // Suma intermedia: total platos comprados por clientes de hab en periodo
        const habId = Number(params.habitacionId || 1);
        const fIni = params.fechaInicio || '2026-10-01';
        const fFin = params.fechaFin || '2026-10-05';
        const clientIds = reservas
          .filter(r => r.habitacionId === habId && r.fechaInicio <= fFin && r.fechaFin >= fIni)
          .map(r => r.clienteId);
        const total = platosComprados
          .filter(pc => clientIds.includes(pc.clienteId))
          .reduce((acc, curr) => acc + curr.valorTotal, 0);
        return {
          tipoReporte: "Suma Intermedia",
          descripcion: `Total compras de platos por clientes de hab. ${habId} entre ${fIni} y ${fFin}`,
          total: total
        };
      }
      case 2: { // Suma facil: total pagado por cliente
        const cId = Number(params.clienteId || 1);
        const cliente = clientes.find(c => c.id === cId) || clientes[0];
        const total = platosComprados
          .filter(pc => pc.clienteId === cId)
          .reduce((acc, curr) => acc + curr.valorTotal, 0);
        return {
          tipoReporte: "Suma Facil",
          descripcion: `Total pagado en platos por cliente ${cliente.nombres} ${cliente.apellidos}`,
          total: total
        };
      }
      case 3: { // Conteo intermedio: platos por cliente en habitacion
        const habId = Number(params.habitacionId || 1);
        const clientIds = [...new Set(reservas.filter(r => r.habitacionId === habId).map(r => r.clienteId))];
        return clientIds.map(cId => {
          const cli = clientes.find(c => c.id === cId);
          const cantidad = platosComprados
            .filter(pc => pc.clienteId === cId)
            .reduce((sum, pc) => sum + pc.cantidad, 0);
          return {
            clienteId: cId,
            numeroDocumento: cli ? cli.numeroDocumento : '',
            nombreCompleto: cli ? `${cli.nombres} ${cli.apellidos}` : '',
            cantidadPlatos: cantidad
          };
        });
      }
      case 4: { // Conteo facil: platos comprados por cliente
        const cId = Number(params.clienteId || 1);
        const cli = clientes.find(c => c.id === cId) || clientes[0];
        const cantidad = platosComprados
          .filter(pc => pc.clienteId === cId)
          .reduce((sum, pc) => sum + pc.cantidad, 0);
        return {
          tipoReporte: "Conteo Facil",
          descripcion: `Cantidad de platos comprados por cliente ${cli.nombres} ${cli.apellidos}`,
          cantidad: cantidad
        };
      }
      case 5: { // Promedio intermedio: promedio compras clientes con reserva
        const reservedClientIds = [...new Set(reservas.map(r => r.clienteId))];
        const compras = platosComprados.filter(pc => reservedClientIds.includes(pc.clienteId));
        const avg = compras.length > 0
          ? compras.reduce((sum, pc) => sum + pc.valorTotal, 0) / compras.length
          : 0;
        return {
          tipoReporte: "Promedio Intermedio",
          descripcion: "Promedio valor compras platos por comensales con reserva",
          promedio: Math.round(avg * 100) / 100
        };
      }
      case 6: { // Promedio facil: valor promedio compras de un cliente
        const cId = Number(params.clienteId || 1);
        const cli = clientes.find(c => c.id === cId) || clientes[0];
        const compras = platosComprados.filter(pc => pc.clienteId === cId);
        const avg = compras.length > 0
          ? compras.reduce((sum, pc) => sum + pc.valorTotal, 0) / compras.length
          : 0;
        return {
          tipoReporte: "Promedio Facil",
          descripcion: `Promedio valor de compras cliente ${cli.nombres} ${cli.apellidos}`,
          promedio: Math.round(avg * 100) / 100
        };
      }
      case 7: { // Maximo intermedio: plato mayor valor en habitacion
        const habId = Number(params.habitacionId || 1);
        const clientIds = reservas.filter(r => r.habitacionId === habId).map(r => r.clienteId);
        const compras = platosComprados
          .filter(pc => clientIds.includes(pc.clienteId))
          .sort((a, b) => b.valorUnitario - a.valorUnitario);
        const mayor = compras[0] || platosComprados[0];
        return {
          clasificacion: "MAYOR_VALOR",
          platoCompradoId: mayor.id,
          tipoPlatoId: mayor.tipoPlatoId,
          nombrePlato: mayor.platoNombre || "Plato",
          valorUnitario: mayor.valorUnitario,
          valorTotal: mayor.valorTotal,
          clienteId: mayor.clienteId,
          clienteNombre: mayor.clienteNombre || "Cliente",
          fechaCompra: mayor.fechaCompra
        };
      }
      case 8: { // Minimo facil: plato menor valor comprado por cliente
        const cId = Number(params.clienteId || 1);
        const compras = platosComprados
          .filter(pc => pc.clienteId === cId)
          .sort((a, b) => a.valorUnitario - b.valorUnitario);
        const menor = compras[0] || platosComprados[0];
        return {
          clasificacion: "MENOR_VALOR",
          platoCompradoId: menor.id,
          tipoPlatoId: menor.tipoPlatoId,
          nombrePlato: menor.platoNombre || "Plato",
          valorUnitario: menor.valorUnitario,
          valorTotal: menor.valorTotal,
          clienteId: menor.clienteId,
          clienteNombre: menor.clienteNombre || "Cliente",
          fechaCompra: menor.fechaCompra
        };
      }
      case 9: { // Busqueda intermedia: clientes con plato X y reserva
        const tpId = Number(params.tipoPlatoId || 1);
        const comprasPlato = platosComprados.filter(pc => pc.tipoPlatoId === tpId);
        const buyerIds = comprasPlato.map(pc => pc.clienteId);
        const reservedClientIds = reservas.map(r => r.clienteId);
        const matchIds = [...new Set(buyerIds.filter(id => reservedClientIds.includes(id)))];
        return clientes.filter(c => matchIds.includes(c.id));
      }
      case 10: { // Busqueda facil: platos comprados por un cliente
        const cId = Number(params.clienteId || 1);
        return platosComprados.filter(pc => pc.clienteId === cId);
      }
      default:
        return null;
    }
  }
}

export const api = new HotelApiClient();
