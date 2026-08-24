import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { DashboardStats } from '../../types';
import { fmtMoney } from '../../utils/format';
import {
  Users, UserCheck, Package, FileText, ShoppingBag,
  DollarSign, TrendingUp, AlertTriangle, ClipboardList,
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: any; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Administrativo</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Ingresos Totales" value={`Bs. ${fmtMoney(stats?.totalIngresos || 0)}`} icon={DollarSign} color="bg-emerald-500" sub={`Hoy: Bs. ${fmtMoney(stats?.ingresosHoy || 0)}`} />
        <StatCard label="Ventas Totales" value={stats?.totalVentas || 0} icon={ShoppingBag} color="bg-blue-500" sub={`Hoy: ${stats?.ventasHoy || 0}`} />
        <StatCard label="Clientes" value={stats?.totalClientes || 0} icon={Users} color="bg-violet-500" />
        <StatCard label="Productos" value={stats?.totalProductos || 0} icon={Package} color="bg-amber-500" sub={`${stats?.productosBajoStock || 0} bajo stock`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Usuarios" value={stats?.totalUsuarios || 0} icon={UserCheck} color="bg-cyan-500" />
        <StatCard label="Recetas" value={stats?.totalRecetas || 0} icon={FileText} color="bg-pink-500" />
        <StatCard label="Órdenes Trabajo" value={stats?.totalOrdenesTrabajo || 0} icon={ClipboardList} color="bg-emerald-500" sub={`${stats?.ordenesPendientes || 0} pendientes`} />
        <StatCard label="Alertas Stock" value={stats?.productosBajoStock || 0} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Últimas Ventas
          </h3>
          {stats?.ventasRecientes && stats.ventasRecientes.length > 0 ? (
            <div className="space-y-3">
              {stats.ventasRecientes.map((venta) => (
                <div key={venta.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{venta.cliente?.nombre} {venta.cliente?.apellido}</p>
                    <p className="text-xs text-slate-400">{new Date(venta.fecha).toLocaleDateString('es-BO')}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">Bs. {fmtMoney(venta.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No hay ventas recientes</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Productos con Stock Bajo
          </h3>
          {stats?.productosBajoStockLista && stats.productosBajoStockLista.length > 0 ? (
            <div className="space-y-3">
              {stats.productosBajoStockLista.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{prod.nombre}</p>
                    <p className="text-xs text-slate-400">{prod.categoria?.nombre}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">{prod.stock} uds</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No hay productos con stock bajo</p>
          )}
        </div>
      </div>
    </div>
  );
}
