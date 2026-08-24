import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { BarChart3, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { fmtMoney } from '../../utils/format';

export default function ReportsPage() {
  const { data: monthlyData, isLoading: loadingMonthly } = useQuery({
    queryKey: ['sales-monthly'],
    queryFn: async () => { const r = await api.get('/sales/reports/monthly'); return r.data; },
  });

  const { data: topProducts, isLoading: loadingTop } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => { const r = await api.get('/sales/reports/top-products'); return r.data; },
  });

  const { data: ventasPorUsuario, isLoading: loadingUsers } = useQuery({
    queryKey: ['sales-by-user'],
    queryFn: async () => { const r = await api.get('/sales/reports/by-user'); return r.data; },
  });

  const totalVentasGeneral = monthlyData?.reduce((acc: number, item: any) => acc + Number(item.total), 0) || 0;
  const totalCantidadVentas = monthlyData?.reduce((acc: number, item: any) => acc + Number(item.count), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="w-7 h-7 text-emerald-500" /> Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Análisis de ventas y rendimiento</p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Total Ventas (Monto)</p>
              <p className="text-lg font-bold text-slate-800">Bs. {fmtMoney(totalVentasGeneral)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Total Ventas (Cantidad)</p>
              <p className="text-lg font-bold text-slate-800">{totalCantidadVentas} ventas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Promedio por Venta</p>
              <p className="text-lg font-bold text-slate-800">Bs. {totalCantidadVentas > 0 ? fmtMoney(Math.round(totalVentasGeneral / totalCantidadVentas)) : '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ventas por usuario */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-500" />
          Ventas por Vendedor
        </h3>
        {loadingUsers ? (
          <div className="h-32 flex items-center justify-center text-slate-400">Cargando...</div>
        ) : ventasPorUsuario && ventasPorUsuario.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Vendedor</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nro. Ventas</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Monto Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ventasPorUsuario.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.vendedor}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{item.totalVentas}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">Bs. {fmtMoney(item.montoTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No hay datos de ventas por vendedor</p>
        )}
      </div>

      {/* Ventas por mes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Ventas por Mes
        </h3>
        {loadingMonthly ? (
          <div className="h-48 flex items-center justify-center text-slate-400">Cargando...</div>
        ) : monthlyData && monthlyData.length > 0 ? (
          <div className="space-y-3">
            {monthlyData.map((item: any) => {
              const maxTotal = Math.max(...monthlyData.map((m: any) => Number(m.total)));
              const width = maxTotal > 0 ? (Number(item.total) / maxTotal) * 100 : 0;
              return (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600 w-20">{item.month}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-end px-3 transition-all" style={{ width: `${Math.max(width, 15)}%` }}>
                      <span className="text-xs font-bold text-white">Bs. {fmtMoney(item.total)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{item.count} ventas</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No hay datos de ventas mensuales</p>
        )}
      </div>

      {/* Top productos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          Productos Más Vendidos
        </h3>
        {loadingTop ? (
          <div className="h-48 flex items-center justify-center text-slate-400">Cargando...</div>
        ) : topProducts && topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Producto</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Unidades Vendidas</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.nombre}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{item.totalVendido} uds</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">Bs. {fmtMoney(item.totalIngresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No hay datos de productos vendidos</p>
        )}
      </div>
    </div>
  );
}
