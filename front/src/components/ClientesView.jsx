import React, { useState } from 'react';
import { Users, Search, Mail, Phone, CreditCard } from 'lucide-react';

export default function ClientesView({ clientes }) {
  const [search, setSearch] = useState('');

  const filtered = clientes.filter((c) => {
    const s = search.toLowerCase();
    const name = `${c.nombres} ${c.apellidos}`.toLowerCase();
    const doc = c.numeroDocumento.toLowerCase();
    const email = (c.correo || '').toLowerCase();
    return name.includes(s) || doc.includes(s) || email.includes(s);
  });

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por documento, nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total: {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cli) => (
          <div
            key={cli.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {cli.nombres} {cli.apellidos}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{cli.tipoDocumento} {cli.numeroDocumento}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                ID #{cli.id}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{cli.correo || 'Sin correo registrado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{cli.telefono || 'Sin telefono registrado'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
