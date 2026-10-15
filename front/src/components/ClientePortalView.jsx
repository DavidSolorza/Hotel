import React, { useState } from 'react';
import {
  BedDouble,
  UtensilsCrossed,
  CalendarDays,
  Receipt,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { api } from '../services/api';

export default function ClientePortalView({
  clientes,
  habitaciones,
  tiposPlato,
  reservas,
  platosComprados,
  onDataChanged
}) {
  const [selectedClienteId, setSelectedClienteId] = useState(clientes[0]?.id || 1);
  const [activeSubTab, setActiveSubTab] = useState('reservar'); // 'reservar', 'restaurante', 'misReservas', 'misConsumos'

  // Formulario de Reserva
  const [selectedHabitacionId, setSelectedHabitacionId] = useState(habitaciones[0]?.id || 1);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [reservaSubmitting, setReservaSubmitting] = useState(false);
  const [reservaSuccessMsg, setReservaSuccessMsg] = useState(null);

  // Formulario de Compra de Plato
  const [selectedPlatoId, setSelectedPlatoId] = useState(tiposPlato[0]?.id || 1);
  const [platoCantidad, setPlatoCantidad] = useState(1);
  const [platoSubmitting, setPlatoSubmitting] = useState(false);
  const [platoSuccessMsg, setPlatoSuccessMsg] = useState(null);

  // Modal para Crear Nuevo Cliente
  const [showNewClienteModal, setShowNewClienteModal] = useState(false);
  const [newClienteForm, setNewClienteForm] = useState({
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: ''
  });

  const clienteActivo = clientes.find(c => c.id === selectedClienteId) || clientes[0];

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calculo de noches y valor estimado
  const habitacionSeleccionada = habitaciones.find(h => h.id === Number(selectedHabitacionId));
  const diffTime = Math.max(1, Math.round((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)));
  const totalEstimado = habitacionSeleccionada ? habitacionSeleccionada.tarifaNoche * diffTime : 0;

  // Filtrar reservas y consumos del cliente activo
  const misReservas = reservas.filter(r => r.clienteId === selectedClienteId);
  const misConsumos = platosComprados.filter(pc => pc.clienteId === selectedClienteId);
  const totalConsumoGasto = misConsumos.reduce((acc, pc) => acc + (pc.valorTotal || 0), 0);

  // Manejador: Crear Reserva
  const handleCrearReserva = async (e) => {
    e.preventDefault();
    setReservaSubmitting(true);
    setReservaSuccessMsg(null);
    try {
      await api.createReserva({
        clienteId: selectedClienteId,
        habitacionId: selectedHabitacionId,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        totalHospedaje: totalEstimado,
        estado: 'CONFIRMADA'
      });
      setReservaSuccessMsg(`Reserva confirmada con exito para la Habitacion ${habitacionSeleccionada?.numero} por ${diffTime} noches.`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error al procesar reserva: ' + err.message);
    } finally {
      setReservaSubmitting(false);
    }
  };

  // Manejador: Comprar Plato
  const handlePedirPlato = async (platoId, cantidad = 1) => {
    setPlatoSubmitting(true);
    setPlatoSuccessMsg(null);
    try {
      const plato = tiposPlato.find(p => p.id === platoId);
      await api.createPlatoComprado({
        clienteId: selectedClienteId,
        tipoPlatoId: platoId,
        cantidad: cantidad,
        valorUnitario: plato?.precioBase || 35000,
        valorTotal: (plato?.precioBase || 35000) * cantidad
      });
      setPlatoSuccessMsg(`Pedido confirmado: ${cantidad}x ${plato?.nombre} cargado a su cuenta.`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error al pedir plato: ' + err.message);
    } finally {
      setPlatoSubmitting(false);
    }
  };

  // Manejador: Registrar Nuevo Cliente
  const handleRegistrarCliente = async (e) => {
    e.preventDefault();
    if (!newClienteForm.nombres || !newClienteForm.numeroDocumento) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    try {
      const created = await api.createCliente(newClienteForm);
      setShowNewClienteModal(false);
      setSelectedClienteId(created.id);
      setNewClienteForm({
        tipoDocumento: 'CC',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: ''
      });
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error al registrar cliente: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Identificacion del Cliente Activo */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {clienteActivo ? clienteActivo.nombres.charAt(0) : 'H'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Huesped Activo
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500">
                {clienteActivo?.tipoDocumento} {clienteActivo?.numeroDocumento}
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {clienteActivo ? `${clienteActivo.nombres} ${clienteActivo.apellidos}` : 'Seleccione cliente'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900 min-w-56"
          >
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombres} {c.apellidos} ({c.numeroDocumento})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewClienteModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Huesped</span>
          </button>
        </div>
      </div>

      {/* Navegacion de Secciones para el Cliente */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'reservar', label: 'Reservar Habitacion', icon: BedDouble },
          { id: 'restaurante', label: 'Pedir en Restaurante', icon: UtensilsCrossed },
          { id: 'misReservas', label: `Mis Reservas (${misReservas.length})`, icon: CalendarDays },
          { id: 'misConsumos', label: `Mis Consumos (${misConsumos.length})`, icon: Receipt },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setReservaSuccessMsg(null);
                setPlatoSuccessMsg(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECCION 1: RESERVAR HABITACION */}
      {activeSubTab === 'reservar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario de Reserva */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-1">Nueva Reserva de Estancia</h4>
            <p className="text-xs text-slate-500 mb-5">Configure su periodo de alojamiento</p>

            {reservaSuccessMsg && (
              <div className="p-3.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>{reservaSuccessMsg}</div>
              </div>
            )}

            <form onSubmit={handleCrearReserva} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Seleccione Habitacion
                </label>
                <select
                  value={selectedHabitacionId}
                  onChange={(e) => setSelectedHabitacionId(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  {habitaciones.map(h => (
                    <option key={h.id} value={h.id}>
                      Hab. {h.numero} - {h.tipo} ({formatMoney(h.tarifaNoche)}/noche) [{h.estado}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fecha de Entrada
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fecha de Salida
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Resumen de Liquidacion */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Duracion de estancia:</span>
                  <span className="font-semibold text-slate-800">{diffTime} {diffTime === 1 ? 'noche' : 'noches'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tarifa por noche:</span>
                  <span className="text-slate-800">{formatMoney(habitacionSeleccionada?.tarifaNoche)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total a Pagar:</span>
                  <span className="text-base font-bold text-slate-900">{formatMoney(totalEstimado)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={reservaSubmitting}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{reservaSubmitting ? 'Confirmando...' : 'Confirmar y Guardar Reserva'}</span>
              </button>
            </form>
          </div>

          {/* Catalogo Visual de Habitaciones */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Habitaciones del Hotel</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habitaciones.map(hab => {
                const isSelected = hab.id === Number(selectedHabitacionId);
                const isDisponible = hab.estado === 'DISPONIBLE';
                return (
                  <div
                    key={hab.id}
                    onClick={() => setSelectedHabitacionId(hab.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Habitacion {hab.numero}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        isDisponible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        {hab.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{hab.tipo} • Capacidad: {hab.capacidad} personas</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">
                        {formatMoney(hab.tarifaNoche)} <span className="text-[10px] font-normal text-slate-400">/ noche</span>
                      </span>
                      <span className={`text-[11px] font-medium ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                        {isSelected ? 'Seleccionada' : 'Elegir'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECCION 2: PEDIR EN EL RESTAURANTE */}
      {activeSubTab === 'restaurante' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Carta del Restaurante El Paisaje Cultural</h4>
              <p className="text-xs text-slate-500">Seleccione los platos tipicos que desea consumir</p>
            </div>
            {platoSuccessMsg && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {platoSuccessMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiposPlato.map(plato => (
              <div
                key={plato.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h5 className="text-sm font-semibold text-slate-900">{plato.nombre}</h5>
                    <span className="text-sm font-bold text-slate-900">
                      {formatMoney(plato.precioBase)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {plato.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Tipo #{plato.id}</span>
                  <button
                    onClick={() => handlePedirPlato(plato.id, 1)}
                    disabled={platoSubmitting}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pedir Plato</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCION 3: MIS RESERVAS */}
      {activeSubTab === 'misReservas' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Historial de Reservas del Huesped</h4>
            <span className="text-xs text-slate-500 font-medium">{misReservas.length} estancias</span>
          </div>

          {misReservas.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No tiene reservas registradas en este momento.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="p-3.5">Folio</th>
                  <th className="p-3.5">Habitacion</th>
                  <th className="p-3.5">Periodo de Estancia</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Total Liquidado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {misReservas.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-slate-500">#{r.id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      Hab. {r.habitacionNumero || r.habitacionId}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {r.fechaInicio} &rarr; {r.fechaFin}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        r.estado === 'CONFIRMADA'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900">
                      {formatMoney(r.totalHospedaje)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* SECCION 4: MIS CONSUMOS */}
      {activeSubTab === 'misConsumos' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Historial de Compras en Restaurante</h4>
            <div className="text-xs font-semibold text-slate-900">
              Total Consumos: {formatMoney(totalConsumoGasto)}
            </div>
          </div>

          {misConsumos.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No registra compras de platos en el restaurante.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="p-3.5">Comprobante</th>
                  <th className="p-3.5">Plato</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 text-center">Cantidad</th>
                  <th className="p-3.5 text-right">Valor Unitario</th>
                  <th className="p-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {misConsumos.map(pc => (
                  <tr key={pc.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-slate-500">#{pc.id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {pc.platoNombre || `Plato #${pc.tipoPlatoId}`}
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">{pc.fechaCompra}</td>
                    <td className="p-3.5 text-center font-medium">{pc.cantidad}</td>
                    <td className="p-3.5 text-right text-slate-600">{formatMoney(pc.valorUnitario)}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900">{formatMoney(pc.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal: Registrar Nuevo Cliente */}
      {showNewClienteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900">Registrar Nuevo Huesped</h4>
              <button
                onClick={() => setShowNewClienteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleRegistrarCliente} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipo Doc.</label>
                  <select
                    value={newClienteForm.tipoDocumento}
                    onChange={(e) => setNewClienteForm({...newClienteForm, tipoDocumento: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="PAS">PAS</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Numero de Documento *</label>
                  <input
                    type="text"
                    required
                    placeholder="1053800..."
                    value={newClienteForm.numeroDocumento}
                    onChange={(e) => setNewClienteForm({...newClienteForm, numeroDocumento: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Andres"
                    value={newClienteForm.nombres}
                    onChange={(e) => setNewClienteForm({...newClienteForm, nombres: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Morales"
                    value={newClienteForm.apellidos}
                    onChange={(e) => setNewClienteForm({...newClienteForm, apellidos: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Correo Electronico</label>
                <input
                  type="email"
                  placeholder="andres.morales@correo.com"
                  value={newClienteForm.correo}
                  onChange={(e) => setNewClienteForm({...newClienteForm, correo: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Telefono</label>
                <input
                  type="text"
                  placeholder="3101234567"
                  value={newClienteForm.telefono}
                  onChange={(e) => setNewClienteForm({...newClienteForm, telefono: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewClienteModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
                >
                  Registrar Huesped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
