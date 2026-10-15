import React from 'react';
import {
  BedDouble,
  Users,
  UtensilsCrossed,
  Receipt,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DashboardView({
  habitaciones,
  clientes,
  reservas,
  tiposPlato,
  platosComprados,
  setActiveTab,
  setSelectedReporteId
}) {
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const habsDisponibles = habitaciones.filter(h => h.estado === 'DISPONIBLE').length;
  const totalConsumo = platosComprados.reduce((acc, p) => acc + (p.valorTotal || 0), 0);
  const totalHospedaje = reservas.reduce((acc, r) => acc + (r.totalHospedaje || 0), 0);

  const stats = [
    {
      label: 'Habitaciones',
      val: `${habsDisponibles} de ${habitaciones.length}`,
      sub: `${habsDisponibles} disponibles para reserva`,
      icon: BedDouble,
      action: () => setActiveTab('habitaciones')
    },
    {
      label: 'Huespedes Registrados',
      val: clientes.length,
      sub: `${reservas.length} reservas registradas`,
      icon: Users,
      action: () => setActiveTab('clientes')
    },
    {
      label: 'Menu del Restaurante',
      val: `${tiposPlato.length} platos`,
      sub: 'Platos tradicionales y a la carta',
      icon: UtensilsCrossed,
      action: () => setActiveTab('restaurante')
    },
    {
      label: 'Consumos en Restaurante',
      val: formatMoney(totalConsumo),
      sub: `${platosComprados.length} compras registradas`,
      icon: Receipt,
      action: () => setActiveTab('platosComprados')
    },
  ];

  const reportesHighlights = [
    { id: 1, title: 'Reporte 1: Suma por habitacion y periodo', desc: 'Calcular total de platos en estancia', tag: 'Intermedio' },
    { id: 3, title: 'Reporte 3: Conteo por cliente en habitacion', desc: 'Contar platos comprados por comensal', tag: 'Intermedio' },
    { id: 5, title: 'Reporte 5: Promedio clientes con reserva', desc: 'Valor promedio de compras de hospedados', tag: 'Intermedio' },
    { id: 7, title: 'Reporte 7: Plato mayor valor en habitacion', desc: 'Plato mas costoso adquirido por huespedes', tag: 'Intermedio' },
    { id: 9, title: 'Reporte 9: Clientes con plato X y reserva', desc: 'Busqueda cruzada entre consumo y estancia', tag: 'Intermedio' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={s.action}
              className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-medium tracking-tight uppercase text-slate-400">
                  {s.label}
                </span>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{s.val}</div>
              <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Reports Quick Access Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Reportes Analiticos Requeridos (Catedra Backend)
            </h3>
            <p className="text-xs text-slate-500">
              Implementacion de las 10 consultas de suma, conteo, promedio, extremos y busquedas
            </p>
          </div>
          <button
            onClick={() => setActiveTab('reportes')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span>Ver los 10 reportes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportesHighlights.map((r) => (
            <div
              key={r.id}
              onClick={() => {
                setSelectedReporteId(r.id);
                setActiveTab('reportes');
              }}
              className="p-4 border border-slate-200/70 rounded-lg hover:border-slate-900/30 hover:bg-slate-50/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {r.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-semibold text-slate-900">{r.title}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Tables Preview: Reservas Recientes & Ultimas Compras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas Recientes */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Reservas Registradas</h4>
              <p className="text-xs text-slate-500">Control de ocupacion hotelera</p>
            </div>
            <button
              onClick={() => setActiveTab('reservas')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {reservas.slice(0, 4).map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-900">{r.clienteNombre || `Cliente #${r.clienteId}`}</p>
                  <p className="text-slate-500 text-[11px]">
                    Habitacion {r.habitacionNumero || r.habitacionId} • {r.fechaInicio} al {r.fechaFin}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                    r.estado === 'CONFIRMADA'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {r.estado}
                  </span>
                  <p className="font-semibold text-slate-900 mt-1">{formatMoney(r.totalHospedaje)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumos Restaurante */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Consumos Recientes</h4>
              <p className="text-xs text-slate-500">Compras de platos en el restaurante</p>
            </div>
            <button
              onClick={() => setActiveTab('platosComprados')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {platosComprados.slice(0, 4).map((pc) => (
              <div key={pc.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-900">{pc.platoNombre || `Plato #${pc.tipoPlatoId}`}</p>
                  <p className="text-slate-500 text-[11px]">
                    {pc.clienteNombre || `Cliente #${pc.clienteId}`} • Cantidad: {pc.cantidad}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatMoney(pc.valorTotal)}</p>
                  <p className="text-slate-400 text-[10px]">{pc.fechaCompra?.split(' ')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
