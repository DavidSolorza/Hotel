import React, { useState } from 'react';
import { BedDouble, Users, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function HabitacionesView({ habitaciones }) {
  const [filter, setFilter] = useState('TODAS');
  const [search, setSearch] = useState('');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filtered = habitaciones.filter((h) => {
    const matchStatus = filter === 'TODAS' || h.estado === filter;
    const matchSearch =
      h.numero.toLowerCase().includes(search.toLowerCase()) ||
      h.tipo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controles de Filtro */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por numero o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {['TODAS', 'DISPONIBLE', 'OCUPADA'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hab) => {
          const isDisponible = hab.estado === 'DISPONIBLE';
          return (
            <div
              key={hab.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">
                    {hab.numero}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Habitacion {hab.numero}</h4>
                    <p className="text-[11px] text-slate-500">{hab.tipo}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                    isDisponible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}
                >
                  {hab.estado}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Capacidad maxima</span>
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hab.capacidad} {hab.capacidad === 1 ? 'persona' : 'personas'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tarifa por noche</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(hab.tarifaNoche)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hotel Gran Caldas</span>
                <span className="font-mono">ID: {hab.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
