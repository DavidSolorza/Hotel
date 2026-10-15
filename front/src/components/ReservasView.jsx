import React, { useState } from 'react';
import { CalendarDays, Search, User, BedDouble } from 'lucide-react';

export default function ReservasView({ reservas }) {
  const [search, setSearch] = useState('');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filtered = reservas.filter((r) => {
    const s = search.toLowerCase();
    const cliente = (r.clienteNombre || '').toLowerCase();
    const hab = String(r.habitacionNumero || r.habitacionId);
    return cliente.includes(s) || hab.includes(s);
  });

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por huesped o habitacion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total: {filtered.length} {filtered.length === 1 ? 'reserva' : 'reservas'}
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
            <tr>
              <th className="p-4">Folio</th>
              <th className="p-4">Huesped</th>
              <th className="p-4">Habitacion</th>
              <th className="p-4">Fechas de Estancia</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Total Hospedaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-500">#{r.id}</td>
                <td className="p-4 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>{r.clienteNombre || `Huesped #${r.clienteId}`}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                    <BedDouble className="w-3 h-3 text-slate-500" />
                    Hab. {r.habitacionNumero || r.habitacionId}
                  </span>
                </td>
                <td className="p-4 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.fechaInicio} &rarr; {r.fechaFin}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    r.estado === 'CONFIRMADA'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.estado}
                  </span>
                </td>
                <td className="p-4 text-right font-semibold text-slate-900">
                  {formatMoney(r.totalHospedaje)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
