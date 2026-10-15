import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  BedDouble,
  CalendarDays,
  UtensilsCrossed,
  Users,
  Receipt,
  ShieldCheck,
  User,
  ShoppingBag
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  backendStatus,
  currentRole,
  setCurrentRole
}) {
  const adminNavItems = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'reportes', label: '10 Reportes Catedra', icon: BarChart3, badge: '10' },
    { id: 'habitaciones', label: 'Habitaciones', icon: BedDouble },
    { id: 'reservas', label: 'Todas las Reservas', icon: CalendarDays },
    { id: 'restaurante', label: 'Menu Restaurante', icon: UtensilsCrossed },
    { id: 'clientes', label: 'Directorio Clientes', icon: Users },
    { id: 'platosComprados', label: 'Registro de Consumos', icon: Receipt },
  ];

  const clienteNavItems = [
    { id: 'clientePortal', label: 'Mi Portal (Reservas y Pedidos)', icon: ShoppingBag, badge: 'Activo' },
    { id: 'habitaciones', label: 'Ver Habitaciones', icon: BedDouble },
    { id: 'restaurante', label: 'Ver Menu del Restaurante', icon: UtensilsCrossed },
  ];

  const currentNav = currentRole === 'admin' ? adminNavItems : clienteNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm tracking-wider">
          HR
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-tight">
            Hotel & Restaurante
          </h1>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {currentRole === 'admin' ? 'Modo Administrador' : 'Portal Huésped'}
          </p>
        </div>
      </div>

      {/* Role Switcher in Sidebar */}
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveTab('dashboard');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${
              currentRole === 'admin'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => {
              setCurrentRole('cliente');
              setActiveTab('clientePortal');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${
              currentRole === 'cliente'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Cliente</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          {currentRole === 'admin' ? 'Administracion' : 'Operaciones Huesped'}
        </div>
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Backend Status Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate">
              {backendStatus.online ? 'Backend Conectado' : 'Modo Demostracion'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {backendStatus.message}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
