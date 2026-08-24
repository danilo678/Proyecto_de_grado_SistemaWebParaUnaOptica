import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Venta, Cliente, Producto, PaginatedResponse } from '../../types';
import { Plus, ShoppingBag, Eye, X, Loader2, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fmtMoney } from '../../utils/format';

interface CarritoItem {
  productoId: number;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  subtotal: number;
}

export default function VentasPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [viewModal, setViewModal] = useState<Venta | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const [clienteId, setClienteId] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [aCuenta, setACuenta] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [searchProducto, setSearchProducto] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<Venta>>({
    queryKey: ['ventas', page, fechaDesde, fechaHasta],
    queryFn: async () => {
      const params: any = { page, limit: 10 };
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;
      const res = await api.get('/sales', { params });
      return res.data;
    },
  });

  const { data: clientes } = useQuery<PaginatedResponse<Cliente>>({
    queryKey: ['clientes-list'],
    queryFn: async () => { const r = await api.get('/clients', { params: { limit: 100 } }); return r.data; },
  });

  const { data: productos } = useQuery<PaginatedResponse<Producto>>({
    queryKey: ['productos-venta', searchProducto],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (searchProducto) params.search = searchProducto;
      const r = await api.get('/products', { params });
      return r.data;
    },
  });

  const crearVentaMutation = useMutation({
    mutationFn: async (dto: any) => api.post('/sales', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      toast.success('Venta registrada correctamente');
      closeModal();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al crear venta'),
  });

  const agregarProducto = (producto: Producto) => {
    const existente = carrito.find((c) => c.productoId === producto.id);
    if (existente) {
      if (existente.cantidad >= producto.stock) {
        toast.error(`Stock insuficiente. Disponible: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map((c) =>
        c.productoId === producto.id
          ? { ...c, cantidad: c.cantidad + 1, subtotal: (c.cantidad + 1) * c.precioVenta }
          : c
      ));
    } else {
      if (producto.stock <= 0) {
        toast.error('Producto sin stock');
        return;
      }
      setCarrito([...carrito, {
        productoId: producto.id,
        nombre: producto.nombre,
        precioVenta: Number(producto.precioVenta),
        cantidad: 1,
        subtotal: Number(producto.precioVenta),
      }]);
    }
    setSearchProducto('');
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter((c) => c.productoId !== productoId));
      return;
    }
    const item = carrito.find((c) => c.productoId === productoId);
    if (item) {
      const producto = productos?.data?.find((p) => p.id === productoId);
      if (producto && cantidad > producto.stock) {
        toast.error(`Stock insuficiente. Disponible: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map((c) =>
        c.productoId === productoId
          ? { ...c, cantidad, subtotal: cantidad * c.precioVenta }
          : c
      ));
    }
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter((c) => c.productoId !== productoId));
  };

  const subtotal = carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);

  const closeModal = () => {
    setShowCreateModal(false);
    setClienteId(0);
    setMetodoPago('EFECTIVO');
    setACuenta('');
    setFechaEntrega('');
    setCarrito([]);
    setSearchProducto('');
  };

  const handleCrearVenta = () => {
    if (clienteId === 0) { toast.error('Seleccione un cliente'); return; }
    if (carrito.length === 0) { toast.error('Agregue al menos un producto'); return; }
    if (!user) { toast.error('Usuario no autenticado'); return; }

    let montoPagado: number | undefined;
    if (aCuenta !== '') {
      montoPagado = Number(aCuenta);
      if (isNaN(montoPagado) || montoPagado < 0) { toast.error('El monto a cuenta no es válido'); return; }
      if (montoPagado > subtotal) { toast.error('El monto a cuenta no puede ser mayor al total'); return; }
    }

    crearVentaMutation.mutate({
      clienteId,
      usuarioId: user.id,
      metodoPago,
      ...(montoPagado !== undefined && { montoPagado }),
      ...(fechaEntrega && { fechaEntrega }),
      detalles: carrito.map((c) => ({
        productoId: c.productoId,
        cantidad: c.cantidad,
        precioUnitario: c.precioVenta,
      })),
    });
  };

  const generarReciboPDF = (venta: Venta) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setTextColor(55, 55, 55);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('OPTICA VICTORIA', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text('Calle Jose Ignacio Leon esq. 6 de Octubre - Oruro', 14, 21);
    doc.text('Tel: 73893488 | Email: opticavictoria@gmail.com', 14, 26);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 55, 55);
    doc.text('RECIBO', pageWidth - 14, 16, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(`Nro: ${venta.recibo?.numeroRecibo || `REC-${String(venta.id).padStart(4, '0')}`}`, pageWidth - 14, 21, { align: 'right' });
    doc.text(`${new Date(venta.fecha).toLocaleDateString('es-BO')} ${new Date(venta.fecha).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 26, { align: 'right' });

    doc.setDrawColor(225, 225, 225);
    doc.line(14, 32, pageWidth - 14, 32);

    let y = 44;
    const filaInfo = (label: string, valor: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(label.toUpperCase(), 14, y);
      doc.setFontSize(10);
      doc.setTextColor(55, 55, 55);
      doc.text(valor, 14, y + 5);
      y += 14;
    };

    filaInfo('Cliente', `${venta.cliente?.nombre ?? ''} ${venta.cliente?.apellido ?? ''}`.trim());
    filaInfo('CI', venta.cliente?.ci || '-');
    filaInfo('Atendido por', `${venta.usuario?.nombre ?? ''} ${venta.usuario?.apellido ?? ''}`.trim());
    filaInfo('Metodo de Pago', venta.metodoPago === 'QR' ? 'QR' : 'Efectivo');

    autoTable(doc, {
      startY: y,
      head: [['Producto', 'Cant.', 'P. Unitario', 'Importe']],
      body: (venta.detalles || []).map((d) => [
        d.producto?.nombre || 'N/A',
        String(d.cantidad),
        `Bs. ${fmtMoney(d.precioUnitario)}`,
        `Bs. ${fmtMoney(d.subtotal)}`,
      ]),
      theme: 'plain',
      styles: { fontSize: 9, textColor: [70, 70, 70], cellPadding: 3 },
      headStyles: { fillColor: [242, 242, 242], textColor: [90, 90, 90], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y + 25;

    const montoPagado = venta.recibo?.montoPagado ?? venta.total;
    const saldo = venta.recibo?.saldo ?? 0;

    let ty = finalY + 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 110);
    doc.text(`A Cuenta: Bs. ${fmtMoney(montoPagado)}`, pageWidth - 14, ty, { align: 'right' });
    ty += 6;
    doc.text(`Saldo: Bs. ${fmtMoney(saldo)}`, pageWidth - 14, ty, { align: 'right' });
    if (venta.recibo?.fechaEntrega) {
      ty += 6;
      doc.text(`Fecha de Entrega: ${new Date(venta.recibo.fechaEntrega).toLocaleDateString('es-BO')}`, pageWidth - 14, ty, { align: 'right' });
    }

    ty += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 74, ty, pageWidth - 14, ty);
    ty += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(45, 45, 45);
    doc.text(`Total: Bs. ${fmtMoney(venta.total)}`, pageWidth - 14, ty, { align: 'right' });

    const footerY = ty + 16;
    doc.setDrawColor(225, 225, 225);
    doc.line(14, footerY, pageWidth - 14, footerY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Este documento es el comprobante de su compra. Gracias por su preferencia.', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.save(`recibo_venta_${venta.id}.pdf`);
    toast.success('Recibo descargado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShoppingBag className="w-7 h-7 text-emerald-500" /> Ventas</h1>
          <p className="text-slate-500 text-sm mt-1">Registrar y consultar ventas</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nueva Venta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Desde:</label>
            <input type="date" value={fechaDesde} onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Hasta:</label>
            <input type="date" value={fechaHasta} onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {(fechaDesde || fechaHasta) && (
            <button onClick={() => { setFechaDesde(''); setFechaHasta(''); setPage(1); }} className="text-sm text-slate-500 hover:text-red-500">Limpiar filtros</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Vendedor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Pago</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{v.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{v.cliente?.nombre} {v.cliente?.apellido}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.usuario?.nombre} {v.usuario?.apellido}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.metodoPago || 'Efectivo'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">Bs. {fmtMoney(v.total)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setViewModal(v)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => generarReciboPDF(v)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Download className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron ventas</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">Página {page} de {data.totalPages}</p>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50">Anterior</button>
              <button disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalle de venta */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">Venta #{viewModal.id}</h2>
              <div className="flex gap-2">
                <button onClick={() => generarReciboPDF(viewModal)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"><Download className="w-4 h-4" /> Recibo</button>
                <button onClick={() => setViewModal(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 uppercase">Cliente</p><p className="text-sm font-medium text-slate-800">{viewModal.cliente?.nombre} {viewModal.cliente?.apellido}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Vendedor</p><p className="text-sm font-medium text-slate-800">{viewModal.usuario?.nombre} {viewModal.usuario?.apellido}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Fecha</p><p className="text-sm text-slate-800">{new Date(viewModal.fecha).toLocaleString('es-BO')}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Método de Pago</p><p className="text-sm text-slate-800">{viewModal.metodoPago || 'Efectivo'}</p></div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Productos</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 rounded-lg">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Producto</th>
                      <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500">Cant.</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">P. Unit.</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewModal.detalles?.map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-3 text-slate-800">{d.producto?.nombre}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{d.cantidad}</td>
                        <td className="px-4 py-3 text-right text-slate-600">Bs. {d.precioUnitario.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800">Bs. {d.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal:</span><span className="text-slate-700">Bs. {fmtMoney(viewModal.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">A Cuenta:</span><span className="text-slate-700">Bs. {fmtMoney(viewModal.recibo?.montoPagado ?? viewModal.total)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Saldo:</span><span className={`font-medium ${(viewModal.recibo?.saldo ?? 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>Bs. {(viewModal.recibo?.saldo ?? 0).toLocaleString()}</span></div>
                {viewModal.recibo?.fechaEntrega && (
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Fecha de Entrega:</span><span className="text-slate-700">{new Date(viewModal.recibo.fechaEntrega).toLocaleDateString('es-BO')}</span></div>
                )}
                {viewModal.recibo && (
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Recibo Nro:</span><span className="text-slate-700">{viewModal.recibo.numeroRecibo}</span></div>
                )}
                <div className="flex justify-between text-base border-t border-slate-200 pt-2"><span className="font-semibold text-slate-700">Total:</span><span className="font-bold text-emerald-600">Bs. {fmtMoney(viewModal.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva venta */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-slate-800">Nueva Venta</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                  <select value={clienteId} onChange={(e) => setClienteId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value={0}>Seleccionar cliente</option>
                    {clientes?.data?.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.apellido} - CI: {c.ci}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
                  <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="QR">QR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">A Cuenta (Bs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Pago total: ${fmtMoney(subtotal)}`}
                    value={aCuenta}
                    onChange={(e) => setACuenta(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Saldo</label>
                  <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                    Bs. {fmtMoney(Math.max(subtotal - (aCuenta === '' ? subtotal : Number(aCuenta)), 0))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Entrega</label>
                  <input
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Buscar y agregar productos</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escriba el nombre del producto..."
                    value={searchProducto}
                    onChange={(e) => setSearchProducto(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchProducto && productos?.data && productos.data.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {productos.data.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => agregarProducto(p)}
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center justify-between border-b border-slate-100 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">{p.nombre}</p>
                            <p className="text-xs text-slate-400">{p.categoria?.nombre} | Stock: {p.stock}</p>
                          </div>
                          <span className="text-sm font-bold text-emerald-600">Bs. {fmtMoney(p.precioVenta)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Productos en la venta ({carrito.length})</h4>
                {carrito.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Busque y agregue productos para la venta</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Producto</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500">Precio</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500">Cantidad</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Subtotal</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {carrito.map((item) => (
                          <tr key={item.productoId} className="bg-white">
                            <td className="px-4 py-3 font-medium text-slate-800">{item.nombre}</td>
                            <td className="px-4 py-3 text-center text-slate-600">Bs. {fmtMoney(item.precioVenta)}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm flex items-center justify-center">-</button>
                                <span className="w-8 text-center font-medium">{item.cantidad}</span>
                                <button onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm flex items-center justify-center">+</button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-slate-800">Bs. {fmtMoney(item.subtotal)}</td>
                            <td className="px-2 py-3 text-center">
                              <button onClick={() => eliminarDelCarrito(item.productoId)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-lg border-t border-slate-200 pt-2">
                  <span className="font-bold text-slate-700">Total:</span>
                  <span className="font-bold text-emerald-600 text-xl">Bs. {fmtMoney(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={closeModal} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button
                  onClick={handleCrearVenta}
                  disabled={crearVentaMutation.isPending || carrito.length === 0 || clienteId === 0}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {crearVentaMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Registrar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
