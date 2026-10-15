import React, { useState } from 'react';
import { Receipt, Search, Clock, DollarSign } from 'lucide-react';

export default function PlatosCompradosView({ platosComprados }) {
  const [search, setSearch] = useState('');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filtered = platosComprados.filter((pc) => {
    const s = search.toLowerCase();
    const plato = (pc.platoNombre || '').toLowerCase();
    const cliente = (pc.clienteNombre || '').toLowerCase();
    return plato.includes(s) || cliente.includes(s);
  });

  const totalRecaudado = filtered.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Controles y Totalizador */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por plato o comensal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            {filtered.length} {filtered.length === 1 ? 'compra registrada' : 'compras registradas'}
          </span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold">
            Total: {formatMoney(totalRecaudado)}
          </div>
        </div>
      </div>

      {/* Tabla de Consumos */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
            <tr>
              <th className="p-4">Ticket</th>
              <th className="p-4">Plato Adquirido</th>
              <th className="p-4">Comensal</th>
              <th className="p-4">Fecha y Hora</th>
              <th className="p-4 text-center">Cantidad</th>
              <th className="p-4 text-right">Valor Unitario</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((pc) => (
              <tr key={pc.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-500">#{pc.id}</td>
                <td className="p-4 font-semibold text-slate-900">
                  {pc.platoNombre || `Plato #${pc.tipoPlatoId}`}
                </td>
                <td className="p-4 text-slate-700">
                  {pc.clienteNombre || `Cliente #${pc.clienteId}`}
                </td>
                <td className="p-4 text-slate-500 font-mono text-[11px]">
                  {pc.fechaCompra}
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-800">
                    {pc.cantidad}
                  </span>
                </td>
                <td className="p-4 text-right text-slate-600">
                  {formatMoney(pc.valorUnitario)}
                </td>
                <td className="p-4 text-right font-bold text-slate-900">
                  {formatMoney(pc.valorTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
