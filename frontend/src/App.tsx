import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminLayout, { RequireAdmin } from './components/layout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import UsuariosPage from './pages/admin/UsuariosPage'
import ClientesPage from './pages/admin/ClientesPage'
import InventarioPage from './pages/admin/InventarioPage'
import RecetasPage from './pages/admin/RecetasPage'
import VentasPage from './pages/admin/VentasPage'
import OrdenesTrabajoPage from './pages/admin/OrdenesTrabajoPage'
import ReportesPage from './pages/admin/ReportesPage'

function HomeRedirect() {
  const { isAuthenticated, isAdmin, isVendedor } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin || isVendedor) return <Navigate to={isAdmin ? '/admin/dashboard' : '/admin/ventas'} replace />
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>} />
          <Route path="usuarios" element={<RequireAdmin><UsuariosPage /></RequireAdmin>} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="inventario" element={<InventarioPage />} />
          <Route path="recetas" element={<RecetasPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="ordenes-trabajo" element={<OrdenesTrabajoPage />} />
          <Route path="reportes" element={<RequireAdmin><ReportesPage /></RequireAdmin>} />
          <Route index element={<HomeRedirect />} />
        </Route>
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
