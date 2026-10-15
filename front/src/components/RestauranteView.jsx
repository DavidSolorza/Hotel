import React, { useState } from 'react';
import { UtensilsCrossed, Search, CheckCircle2 } from 'lucide-react';

export default function RestauranteView({ tiposPlato }) {
  const [search, setSearch] = useState('');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filtered = tiposPlato.filter((tp) =>
    tp.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (tp.descripcion || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-white uppercase">
              Restaurante del Hotel
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">El Paisaje Cultural</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">Carta y Platos Tipicos</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de platos disponibles para huespedes y comensales
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar plato en el menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Grid de Platos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((plato) => (
          <div
            key={plato.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-semibold text-slate-900">{plato.nombre}</h4>
                <span className="text-sm font-bold text-slate-900 shrink-0">
                  {formatMoney(plato.precioBase)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {plato.descripcion}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400">Tipo ID: #{plato.id}</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Disponible en cocina
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
