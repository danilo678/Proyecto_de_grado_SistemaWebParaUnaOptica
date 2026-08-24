import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  FileText,
  ShoppingBag,
  ClipboardList,
  BarChart3,
  LogOut,
  Eye,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { to: '/admin/usuarios', label: 'Usuarios', icon: UserCog, adminOnly: true },
  { to: '/admin/clientes', label: 'Clientes', icon: Users, adminOnly: false },
  { to: '/admin/inventario', label: 'Productos', icon: Package, adminOnly: false },
  { to: '/admin/recetas', label: 'Recetas', icon: FileText, adminOnly: false },
  { to: '/admin/ventas', label: 'Ventas', icon: ShoppingBag, adminOnly: false },
  { to: '/admin/ordenes-trabajo', label: 'Órdenes Trabajo', icon: ClipboardList, adminOnly: false },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3, adminOnly: true },
];

export default function Sidebar() {
  const { logout, user, isAdmin } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col z-50 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Óptica Victoria</h1>
            <p className="text-xs text-slate-400">{isAdmin ? 'Panel Administrativo' : 'Panel de Vendedor'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.filter((item) => !item.adminOnly || isAdmin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-slate-400">{user?.rol?.nombre}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
