import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ReportesView from './components/ReportesView';
import HabitacionesView from './components/HabitacionesView';
import ReservasView from './components/ReservasView';
import RestauranteView from './components/RestauranteView';
import ClientesView from './components/ClientesView';
import PlatosCompradosView from './components/PlatosCompradosView';
import ClientePortalView from './components/ClientePortalView';
import { api } from './services/api';

export default function App() {
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'cliente'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReporteId, setSelectedReporteId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, message: 'Comprobando conexion...' });

  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [tiposPlato, setTiposPlato] = useState([]);
  const [platosComprados, setPlatosComprados] = useState([]);

  const checkHealth = async () => {
    const status = await api.checkBackendHealth();
    setBackendStatus(status);
  };

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      await checkHealth();
      const [habs, clis, res, platos, compras] = await Promise.all([
        api.getHabitaciones(),
        api.getClientes(),
        api.getReservas(),
        api.getTiposPlato(),
        api.getPlatosComprados(),
      ]);

      setHabitaciones(habs || []);
      setClientes(clis || []);
      setReservas(res || []);
      setTiposPlato(platos || []);
      setPlatosComprados(compras || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'cliente') {
      setActiveTab('clientePortal');
    } else {
      setActiveTab('dashboard');
    }
  };

  const getTabMetadata = () => {
    if (currentRole === 'cliente' && activeTab === 'clientePortal') {
      return {
        title: 'Portal de Atencion al Huesped',
        subtitle: 'Reserve su habitacion, pida platos de la carta y consulte sus movimientos',
      };
    }

    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Panel General de Gestion',
          subtitle: 'Resumen consolidado de operaciones hoteleras y gastronomicas',
        };
      case 'reportes':
        return {
          title: '10 Reportes de Negocio (Catedra Backend)',
          subtitle: 'Ejecucion de calculos agregados: sumas, conteos, promedios, max/min y busquedas',
        };
      case 'habitaciones':
        return {
          title: 'Catalogo de Habitaciones',
          subtitle: 'Estado de ocupacion, categorias y tarifas por noche',
        };
      case 'reservas':
        return {
          title: 'Control de Reservas y Estancias',
          subtitle: 'Seguimiento a periodos de hospedaje y liquidacion total',
        };
      case 'restaurante':
        return {
          title: 'Menu del Restaurante',
          subtitle: 'Especialidades culinarias y precios base asignados',
        };
      case 'clientes':
        return {
          title: 'Directorio de Huespedes y Comensales',
          subtitle: 'Registro de clientes y documentos de identificacion',
        };
      case 'platosComprados':
        return {
          title: 'Registro de Consumos y Facturacion',
          subtitle: 'Detalle de platos adquiridos por los clientes',
        };
      case 'clientePortal':
        return {
          title: 'Portal de Autoservicio Huesped',
          subtitle: 'Gestion personal de reservas y ordenes en restaurante',
        };
      default:
        return { title: 'Sistema Hotel', subtitle: '' };
    }
  };

  const meta = getTabMetadata();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Sidebar de Navegacion */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
      />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          backendStatus={backendStatus}
          onCheckHealth={checkHealth}
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                habitaciones={habitaciones}
                clientes={clientes}
                reservas={reservas}
                tiposPlato={tiposPlato}
                platosComprados={platosComprados}
                setActiveTab={setActiveTab}
                setSelectedReporteId={setSelectedReporteId}
              />
            )}

            {activeTab === 'clientePortal' && (
              <ClientePortalView
                clientes={clientes}
                habitaciones={habitaciones}
                tiposPlato={tiposPlato}
                reservas={reservas}
                platosComprados={platosComprados}
                onDataChanged={loadAllData}
              />
            )}

            {activeTab === 'reportes' && (
              <ReportesView
                habitaciones={habitaciones}
                clientes={clientes}
                tiposPlato={tiposPlato}
                initialReporteId={selectedReporteId}
              />
            )}

            {activeTab === 'habitaciones' && (
              <HabitacionesView habitaciones={habitaciones} />
            )}

            {activeTab === 'reservas' && (
              <ReservasView reservas={reservas} />
            )}

            {activeTab === 'restaurante' && (
              <RestauranteView tiposPlato={tiposPlato} />
            )}

            {activeTab === 'clientes' && (
              <ClientesView clientes={clientes} />
            )}

            {activeTab === 'platosComprados' && (
              <PlatosCompradosView platosComprados={platosComprados} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
