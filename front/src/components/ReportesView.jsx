import React, { useState, useEffect } from 'react';
import {
  Search,
  Calculator,
  Hash,
  Percent,
  TrendingUp,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function ReportesView({
  habitaciones,
  clientes,
  tiposPlato,
  initialReporteId = 1
}) {
  const [selectedReporteId, setSelectedReporteId] = useState(initialReporteId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Parametros de consulta
  const [habitacionId, setHabitacionId] = useState(habitaciones[0]?.id || 1);
  const [clienteId, setClienteId] = useState(clientes[0]?.id || 1);
  const [tipoPlatoId, setTipoPlatoId] = useState(tiposPlato[0]?.id || 1);
  const [fechaInicio, setFechaInicio] = useState('2026-10-01');
  const [fechaFin, setFechaFin] = useState('2026-10-05');

  const reportes = [
    {
      id: 1,
      categoria: 'Suma',
      nivel: 'Intermedio',
      titulo: '1. Suma de Platos por Habitacion y Periodo',
      descripcion: 'Calcula el valor total de los platos comprados por clientes que se hospedaron en una habitacion durante un rango de fechas.',
      params: ['habitacion', 'periodo'],
    },
    {
      id: 2,
      categoria: 'Suma',
      nivel: 'Facil',
      titulo: '2. Suma Total Pagada por Cliente',
      descripcion: 'Calcula el total pagado por las compras de platos registradas para un cliente seleccionado.',
      params: ['cliente'],
    },
    {
      id: 3,
      categoria: 'Conteo',
      nivel: 'Intermedio',
      titulo: '3. Conteo de Platos por Cliente en Habitacion',
      descripcion: 'Cuenta cuantos platos ha comprado cada cliente que realizo una reserva en una habitacion determinada.',
      params: ['habitacion'],
    },
    {
      id: 4,
      categoria: 'Conteo',
      nivel: 'Facil',
      titulo: '4. Conteo de Platos Comprados por Cliente',
      descripcion: 'Cuenta el numero total de platos comprados por un cliente seleccionado.',
      params: ['cliente'],
    },
    {
      id: 5,
      categoria: 'Promedio',
      nivel: 'Intermedio',
      titulo: '5. Promedio de Compras de Clientes con Reserva',
      descripcion: 'Calcula el promedio del valor de las compras de platos realizadas por clientes que tienen reserva en el hotel.',
      params: [],
    },
    {
      id: 6,
      categoria: 'Promedio',
      nivel: 'Facil',
      titulo: '6. Promedio de Valor por Cliente',
      descripcion: 'Calcula el valor promedio de las compras de platos de un cliente seleccionado.',
      params: ['cliente'],
    },
    {
      id: 7,
      categoria: 'Extremo',
      nivel: 'Intermedio',
      titulo: '7. Plato de Mayor Valor en Habitacion',
      descripcion: 'Identifica el plato de mayor valor comprado por clientes que se hospedaron en una habitacion seleccionada.',
      params: ['habitacion'],
    },
    {
      id: 8,
      categoria: 'Extremo',
      nivel: 'Facil',
      titulo: '8. Plato de Menor Valor de un Cliente',
      descripcion: 'Identifica el plato de menor valor entre las compras de un cliente seleccionado.',
      params: ['cliente'],
    },
    {
      id: 9,
      categoria: 'Busqueda',
      nivel: 'Intermedio',
      titulo: '9. Clientes por Tipo de Plato y con Reserva',
      descripcion: 'Busca clientes que compraron un tipo de plato indicado y que ademas reservaron al menos una habitacion.',
      params: ['tipoPlato'],
    },
    {
      id: 10,
      categoria: 'Busqueda',
      nivel: 'Facil',
      titulo: '10. Platos Comprados por Cliente',
      descripcion: 'Lista todas las compras de platos individuales registradas para un cliente seleccionado.',
      params: ['cliente'],
    },
  ];

  const currentReporte = reportes.find((r) => r.id === selectedReporteId) || reportes[0];

  const handleEjecutarReporte = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReporte(selectedReporteId, {
        habitacionId,
        clienteId,
        tipoPlatoId,
        fechaInicio,
        fechaFin,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al ejecutar el reporte');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEjecutarReporte();
  }, [selectedReporteId]);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Selector de los 10 reportes (Columna Izquierda) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[740px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900">Catalogo de 10 Reportes</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Seleccione la consulta a ejecutar</p>
        </div>

        <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
          {reportes.map((rep) => {
            const isSelected = rep.id === selectedReporteId;
            return (
              <button
                key={rep.id}
                onClick={() => setSelectedReporteId(rep.id)}
                className={`w-full text-left p-3.5 transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase ${
                        isSelected
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rep.categoria} • {rep.nivel}
                    </span>
                  </div>
                  <h4 className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {rep.titulo}
                  </h4>
                  <p
                    className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {rep.descripcion}
                  </p>
                </div>
                <ArrowRight
                  className={`w-4 h-4 shrink-0 mt-1 ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de Configuracion y Resultados (Columna Derecha) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Parametros del reporte activo */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {currentReporte.categoria}
                </span>
                <span className="text-[10px] font-medium text-slate-400">•</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  Nivel {currentReporte.nivel}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                {currentReporte.titulo}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{currentReporte.descripcion}</p>
            </div>
            <button
              onClick={handleEjecutarReporte}
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-2 shadow-xs"
            >
              <Search className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Calculando...' : 'Ejecutar Consulta'}</span>
            </button>
          </div>

          {/* Formulario Dinamico de Parametros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentReporte.params.includes('habitacion') && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Habitacion a Consultar
                </label>
                <select
                  value={habitacionId}
                  onChange={(e) => setHabitacionId(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  {habitaciones.map((h) => (
                    <option key={h.id} value={h.id}>
                      Habitacion {h.numero} ({h.tipo} - {formatMoney(h.tarifaNoche)}/noche)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentReporte.params.includes('cliente') && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Huesped / Cliente
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombres} {c.apellidos} (Doc: {c.numeroDocumento})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentReporte.params.includes('tipoPlato') && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Tipo de Plato del Menu
                </label>
                <select
                  value={tipoPlatoId}
                  onChange={(e) => setTipoPlatoId(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  {tiposPlato.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.nombre} ({formatMoney(tp.precioBase)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentReporte.params.includes('periodo') && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Fecha Inicio Estancia
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Fecha Fin Estancia
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </>
            )}

            {currentReporte.params.length === 0 && (
              <div className="md:col-span-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                Este reporte no requiere parametros adicionales; computa sobre todos los comensales con reserva en el hotel.
              </div>
            )}
          </div>
        </div>

        {/* Visualizacion de Resultados */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900">Resultado de la Operacion</h4>
            <span className="text-[11px] text-slate-400">Calculo en tiempo real</span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs">Consultando base de datos...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          ) : !result ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Sin datos para mostrar.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reportes de Suma (1 y 2) */}
              {result.total !== undefined && (
                <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    {result.tipoReporte || 'Total Liquidado'}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                    {formatMoney(result.total)}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{result.descripcion}</p>
                </div>
              )}

              {/* Reportes de Conteo Facil (4) */}
              {result.cantidad !== undefined && (
                <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    {result.tipoReporte || 'Total Unidades'}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                    {result.cantidad} <span className="text-sm font-normal text-slate-500">platos</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{result.descripcion}</p>
                </div>
              )}

              {/* Reportes de Promedio (5 y 6) */}
              {result.promedio !== undefined && (
                <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    {result.tipoReporte || 'Valor Promedio'}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                    {formatMoney(result.promedio)}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{result.descripcion}</p>
                </div>
              )}

              {/* Reportes Extremos (7 y 8: Mayor o Menor Valor) */}
              {result.clasificacion && (
                <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-white uppercase text-[10px]">
                      {result.clasificacion === 'MAYOR_VALOR' ? 'Plato Mas Costoso' : 'Plato Mas Economico'}
                    </span>
                    <span className="text-xs text-slate-500">ID Compra #{result.platoCompradoId}</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-slate-900">{result.nombrePlato}</h5>
                    <p className="text-xs text-slate-500">
                      Adquirido por: {result.clienteNombre} (ID Cliente: {result.clienteId})
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Valor Unitario</p>
                      <p className="text-base font-semibold text-slate-900">
                        {formatMoney(result.valorUnitario)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Total Facturado</p>
                      <p className="text-base font-semibold text-slate-900">
                        {formatMoney(result.valorTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reporte Conteo Tabular (Reporte 3) */}
              {Array.isArray(result) && result.length > 0 && result[0].cantidadPlatos !== undefined && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                      <tr>
                        <th className="p-3">Doc. Identidad</th>
                        <th className="p-3">Huesped</th>
                        <th className="p-3 text-right">Platos Comprados</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-slate-500">{row.numeroDocumento}</td>
                          <td className="p-3 font-medium text-slate-900">{row.nombreCompleto}</td>
                          <td className="p-3 text-right font-semibold text-slate-900">
                            {row.cantidadPlatos}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Reporte Busqueda Clientes (Reporte 9) */}
              {Array.isArray(result) && result.length > 0 && result[0].nombres !== undefined && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                      <tr>
                        <th className="p-3">Identificacion</th>
                        <th className="p-3">Nombre Completo</th>
                        <th className="p-3">Contacto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.map((cli) => (
                        <tr key={cli.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-slate-500">
                            {cli.tipoDocumento} {cli.numeroDocumento}
                          </td>
                          <td className="p-3 font-medium text-slate-900">
                            {cli.nombres} {cli.apellidos}
                          </td>
                          <td className="p-3 text-slate-600">
                            {cli.correo} • {cli.telefono}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Reporte Busqueda Platos de Cliente (Reporte 10) */}
              {Array.isArray(result) && result.length > 0 && result[0].valorTotal !== undefined && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                      <tr>
                        <th className="p-3">Plato</th>
                        <th className="p-3">Cantidad</th>
                        <th className="p-3 text-right">Valor Unitario</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-900">
                            {row.platoNombre || `Plato #${row.tipoPlatoId}`}
                          </td>
                          <td className="p-3 text-slate-600">{row.cantidad}</td>
                          <td className="p-3 text-right text-slate-600">
                            {formatMoney(row.valorUnitario)}
                          </td>
                          <td className="p-3 text-right font-semibold text-slate-900">
                            {formatMoney(row.valorTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Si es arreglo vacio */}
              {Array.isArray(result) && result.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No se encontraron registros que cumplan con los criterios especificados.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
