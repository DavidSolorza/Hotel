import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, User } from 'lucide-react';

export default function Header({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
  backendStatus,
  onCheckHealth,
  currentRole,
  setCurrentRole
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 font-normal">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Selector de Rol: Administrador vs Cliente */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setCurrentRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Vista Admin</span>
          </button>
          <button
            onClick={() => setCurrentRole('cliente')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentRole === 'cliente'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-700" />
            <span>Vista Cliente</span>
          </button>
        </div>

        {/* Estado del Backend */}
        <button
          onClick={onCheckHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          title="Verificar conexion con Spring Boot"
        >
          {backendStatus.online ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{backendStatus.online ? 'Spring Boot 8080' : 'Reconectar'}</span>
        </button>

        {/* Boton Refrescar */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Recargar datos"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-slate-900' : ''}`} />
        </button>
      </div>
    </header>
  );
}
