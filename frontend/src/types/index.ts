export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  usuario: string;
  telefono?: string;
  direccion?: string;
  rolId: number;
  rol: Rol;
  createdAt?: string;
}

export interface Cliente {
  id: number;
  ci: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  sexo?: string;
  fechaRegistro: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  categoriaId: number;
  categoria: Categoria;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  color?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
}

export interface Receta {
  id: number;
  clienteId: number;
  cliente: Cliente;
  fecha: string;
  clinicaExterna?: string;
  esferaOd?: number;
  cilindroOd?: number;
  ejeOd?: number;
  addOd?: number;
  dpOd?: number;
  esferaOs?: number;
  cilindroOs?: number;
  ejeOs?: number;
  addOs?: number;
  dpOs?: number;
  observaciones?: string;
}

export interface DetalleVenta {
  id: number;
  ventaId: number;
  productoId: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  clienteId: number;
  cliente: Cliente;
  usuarioId: number;
  usuario: Usuario;
  fecha: string;
  subtotal: number;
  total: number;
  metodoPago?: string;
  detalles: DetalleVenta[];
  recibo?: Recibo;
}

export interface Recibo {
  id: number;
  ventaId: number;
  venta: Venta;
  numeroRecibo: string;
  fechaEmision: string;
  montoPagado: number;
  saldo: number;
  fechaEntrega?: string;
  observaciones?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdenTrabajo {
  id: number;
  clienteId: number;
  cliente: Cliente;
  recetaId?: number;
  receta?: Receta;
  ventaId?: number;
  venta?: Venta;
  fechaIngreso: string;
  fechaEntrega?: string;
  estado: string;
  observaciones?: string;
}

export interface DashboardStats {
  totalUsuarios: number;
  totalClientes: number;
  totalProductos: number;
  totalRecetas: number;
  totalVentas: number;
  totalOrdenesTrabajo: number;
  ventasHoy: number;
  ordenesPendientes: number;
  totalIngresos: number;
  ingresosHoy: number;
  productosBajoStock: number;
  ventasRecientes: Venta[];
  productosBajoStockLista: Producto[];
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
}
