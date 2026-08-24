import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { capitalizar, fmtMoney } from '../../utils/format';
import { OrdenTrabajo, Cliente, Receta, Venta, PaginatedResponse } from '../../types';
import { Plus, Pencil, Trash2, X, Loader2, ClipboardList, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const schema = z.object({
  clienteId: z.number().min(1, 'Cliente requerido'),
  recetaId: z.number().optional(),
  ventaId: z.number().optional(),
  fechaEntrega: z.string().optional(),
  estado: z.string().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ESTADOS = ['PENDIENTE', 'EN PROCESO', 'LISTO PARA ENTREGA', 'ENTREGADO'];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-amber-100 text-amber-700';
    case 'EN PROCESO': return 'bg-blue-100 text-blue-700';
    case 'LISTO PARA ENTREGA': return 'bg-violet-100 text-violet-700';
    case 'ENTREGADO': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export default function OrdenesTrabajoPage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState<OrdenTrabajo | null>(null);
  const [editing, setEditing] = useState<OrdenTrabajo | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchClienteId = watch('clienteId');

  const { data: clients } = useQuery<PaginatedResponse<Cliente>>({
    queryKey: ['clients-all'],
    queryFn: async () => { const r = await api.get('/clients', { params: { limit: 100 } }); return r.data; },
  });

  const { data: recetas } = useQuery<PaginatedResponse<Receta>>({
    queryKey: ['prescriptions-all'],
    queryFn: async () => { const r = await api.get('/prescriptions', { params: { limit: 100 } }); return r.data; },
  });

  const { data: ventas } = useQuery<PaginatedResponse<Venta>>({
    queryKey: ['ventas-all'],
    queryFn: async () => { const r = await api.get('/sales', { params: { limit: 100 } }); return r.data; },
  });

  const { data, isLoading } = useQuery<PaginatedResponse<OrdenTrabajo>>({
    queryKey: ['work-orders', page, estadoFilter],
    queryFn: async () => {
      const params: any = { page, limit: 10 };
      if (estadoFilter) params.estado = estadoFilter;
      const res = await api.get('/work-orders', { params });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (dto: FormData) => api.post('/work-orders', dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['work-orders'] }); toast.success('Orden de trabajo creada'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...dto }: any) => api.put(`/work-orders/${id}`, dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['work-orders'] }); toast.success('Orden actualizada'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/work-orders/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['work-orders'] }); toast.success('Orden eliminada'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  useEffect(() => {
    if (watchClienteId && watchClienteId > 0 && !editing) {
      setSelectedClientId(watchClienteId);

      const clienteRecetas = recetas?.data?.filter((r) => r.clienteId === watchClienteId) || [];
      if (clienteRecetas.length > 0) {
        const ultimaReceta = clienteRecetas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
        setValue('recetaId', ultimaReceta.id);
      }

      const clienteVentas = ventas?.data?.filter((v) => v.clienteId === watchClienteId) || [];
      if (clienteVentas.length > 0) {
        const ultimaVenta = clienteVentas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
        setValue('ventaId', ultimaVenta.id);
      }
    }
  }, [watchClienteId, recetas, ventas, editing, setValue]);

  const openCreate = () => {
    setEditing(null);
    setSelectedClientId(0);
    reset({ clienteId: 0, recetaId: undefined, ventaId: undefined, fechaEntrega: '', estado: 'PENDIENTE', observaciones: '' });
    setShowModal(true);
  };

  const openEdit = (ot: OrdenTrabajo) => {
    setEditing(ot);
    setSelectedClientId(ot.clienteId);
    reset({
      clienteId: ot.clienteId,
      recetaId: ot.recetaId || undefined,
      ventaId: ot.ventaId || undefined,
      fechaEntrega: ot.fechaEntrega ? new Date(ot.fechaEntrega).toISOString().split('T')[0] : '',
      estado: ot.estado,
      observaciones: ot.observaciones || '',
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setSelectedClientId(0); reset(); };

  const onSubmit = (fd: FormData) => {
    const datos = { ...fd, observaciones: capitalizar(fd.observaciones) };
    if (!datos.recetaId) delete datos.recetaId;
    if (!datos.ventaId) delete datos.ventaId;
    if (!datos.fechaEntrega) delete datos.fechaEntrega;
    if (editing) updateMutation.mutate({ id: editing.id, ...datos });
    else createMutation.mutate(datos);
  };

  const generarOrdenPDF = (ot: OrdenTrabajo) => {
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
    doc.text('ORDEN DE TRABAJO', pageWidth - 14, 16, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(`Nro: #${ot.id}`, pageWidth - 14, 21, { align: 'right' });
    doc.text(`Ingreso: ${new Date(ot.fechaIngreso).toLocaleDateString('es-BO')}`, pageWidth - 14, 26, { align: 'right' });

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

    filaInfo('Cliente', `${ot.cliente?.nombre ?? ''} ${ot.cliente?.apellido ?? ''}`.trim());
    filaInfo('CI', ot.cliente?.ci || '-');
    filaInfo('Telefono', ot.cliente?.telefono || '-');
    filaInfo('Estado', ot.estado);
    filaInfo('Fecha de Entrega', ot.fechaEntrega ? new Date(ot.fechaEntrega).toLocaleDateString('es-BO') : 'No definida');

    const seccion = (titulo: string) => {
      y += 4;
      doc.setDrawColor(225, 225, 225);
      doc.line(14, y, pageWidth - 14, y);
      y += 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(titulo.toUpperCase(), 14, y);
      y += 6;
    };

    if (ot.receta) {
      seccion('Receta Asociada');
      autoTable(doc, {
        startY: y,
        head: [['Ojo', 'Esfera', 'Cilindro', 'Eje', 'A.V.', 'D.I.P.']],
        body: [
          ['OD', String(ot.receta.esferaOd || '-'), String(ot.receta.cilindroOd || '-'), String(ot.receta.ejeOd || '-'), String(ot.receta.addOd || '-'), String(ot.receta.dpOd || '-')],
          ['DI', String(ot.receta.esferaOs || '-'), String(ot.receta.cilindroOs || '-'), String(ot.receta.ejeOs || '-'), String(ot.receta.addOs || '-'), String(ot.receta.dpOs || '-')],
        ],
        theme: 'plain',
        styles: { fontSize: 9, textColor: [70, 70, 70], cellPadding: 3, halign: 'center' },
        headStyles: { fillColor: [242, 242, 242], textColor: [90, 90, 90], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      });
      y = (doc as any).lastAutoTable?.finalY + 6;
    }

    if (ot.venta) {
      seccion('Venta Asociada');
      autoTable(doc, {
        startY: y,
        head: [['Producto', 'Cant.', 'P. Unitario', 'Importe']],
        body: (ot.venta.detalles || []).map((d) => [
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
      const ventaFinalY = (doc as any).lastAutoTable?.finalY || y + 20;

      let ty = ventaFinalY + 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 110, 110);
      if (ot.venta.recibo && ot.venta.recibo.saldo > 0) {
        doc.text(`Saldo: Bs. ${fmtMoney(ot.venta.recibo.saldo)}`, pageWidth - 14, ty, { align: 'right' });
        ty += 6;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(pageWidth - 74, ty, pageWidth - 14, ty);
      ty += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(45, 45, 45);
      doc.text(`Total Venta: Bs. ${fmtMoney(ot.venta.total)}`, pageWidth - 14, ty, { align: 'right' });
      y = ty + 4;
    }

    if (ot.observaciones) {
      seccion('Observaciones');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 70, 70);
      const lines = doc.splitTextToSize(ot.observaciones, pageWidth - 28);
      doc.text(lines, 14, y);
      y += lines.length * 5;
    }

    const footerY = Math.max(y + 12, 275);
    doc.setDrawColor(225, 225, 225);
    doc.line(14, footerY, pageWidth - 14, footerY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Documento interno de trabajo. Gracias por su preferencia.', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.save(`orden_trabajo_${ot.id}.pdf`);
    toast.success('PDF de orden descargado');
  };

  const clientesFiltrados = recetas?.data
    ? [...new Set(recetas.data.map((r) => r.clienteId))]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-7 h-7 text-emerald-500" /> Órdenes de Trabajo</h1>
          <p className="text-slate-500 text-sm mt-1">Gestionar órdenes de trabajo y seguimiento</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nueva Orden
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={estadoFilter} onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {estadoFilter && (
            <button onClick={() => { setEstadoFilter(''); setPage(1); }} className="text-sm text-slate-500 hover:text-red-500">Limpiar filtro</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha Ingreso</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha Entrega</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Observaciones</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((ot) => (
                  <tr key={ot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{ot.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{ot.cliente?.nombre} {ot.cliente?.apellido}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(ot.fechaIngreso).toLocaleDateString('es-BO')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {ot.fechaEntrega ? new Date(ot.fechaEntrega).toLocaleDateString('es-BO') : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoColor(ot.estado)}`}>{ot.estado}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{ot.observaciones || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => generarOrdenPDF(ot)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                        <button onClick={() => setViewModal(ot)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(ot)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        {isAdmin && (
                          <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(ot.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron órdenes de trabajo</td></tr>
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

      {viewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">Orden de Trabajo #{viewModal.id}</h2>
              <div className="flex gap-2">
                <button onClick={() => generarOrdenPDF(viewModal)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"><Download className="w-4 h-4" /> PDF</button>
                <button onClick={() => setViewModal(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 uppercase">Cliente</p><p className="text-sm font-medium text-slate-800">{viewModal.cliente?.nombre} {viewModal.cliente?.apellido}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Estado</p><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoColor(viewModal.estado)}`}>{viewModal.estado}</span></div>
                <div><p className="text-xs text-slate-400 uppercase">Fecha Ingreso</p><p className="text-sm text-slate-800">{new Date(viewModal.fechaIngreso).toLocaleString('es-BO')}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Fecha Entrega</p><p className="text-sm text-slate-800">{viewModal.fechaEntrega ? new Date(viewModal.fechaEntrega).toLocaleDateString('es-BO') : 'No definida'}</p></div>
              </div>
              {viewModal.receta && (
                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                  <div className="px-4 py-2.5 bg-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Receta Asociada - #{viewModal.receta.id}</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-left w-1/6">Ojo</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase text-center">Esfera</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase text-center">Cilindro</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase text-center">Eje</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase text-center">A.V.</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase text-center">D.I.P.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-white">
                        <td className="px-4 py-2 font-bold text-blue-600">OD</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.esferaOd || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.cilindroOd || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.ejeOd || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.addOd || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.dpOd || '-'}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-2 font-bold text-green-600">DI</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.esferaOs || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.cilindroOs || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.ejeOs || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.addOs || '-'}</td>
                        <td className="px-3 py-2 text-center">{viewModal.receta.dpOs || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {viewModal.venta && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-xs text-emerald-600 uppercase font-semibold mb-2">Venta Asociada</p>
                  <p className="text-sm text-slate-700">Venta #{viewModal.venta.id} - Total: Bs. {fmtMoney(viewModal.venta.total)}</p>
                  {viewModal.venta.detalles && viewModal.venta.detalles.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {viewModal.venta.detalles.map((d) => (
                        <li key={d.id} className="text-xs text-slate-500">{d.cantidad}x {d.producto?.nombre} - Bs. {fmtMoney(d.subtotal)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {viewModal.observaciones && (
                <div><p className="text-xs text-slate-400 uppercase mb-1">Observaciones</p><p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{viewModal.observaciones}</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Editar Orden' : 'Nueva Orden de Trabajo'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                <select {...register('clienteId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value={0}>Seleccionar cliente</option>
                  {clients?.data?.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.apellido} - CI: {c.ci}</option>)}
                </select>
                {errors.clienteId && <p className="text-red-500 text-xs mt-1">{errors.clienteId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Receta</label>
                  <select {...register('recetaId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Sin receta</option>
                    {recetas?.data?.filter((r) => !selectedClientId || r.clienteId === selectedClientId).map((r) => (
                      <option key={r.id} value={r.id}>#{r.id} - {r.cliente?.nombre} ({new Date(r.fecha).toLocaleDateString('es-BO')})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Venta</label>
                  <select {...register('ventaId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Sin venta</option>
                    {ventas?.data?.filter((v) => !selectedClientId || v.clienteId === selectedClientId).map((v) => (
                      <option key={v.id} value={v.id}>#{v.id} - {v.cliente?.nombre} (Bs. {fmtMoney(v.total)})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Entrega</label>
                  <input type="date" {...register('fechaEntrega')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select {...register('estado')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea {...register('observaciones')} rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Detalles del trabajo a realizar..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 flex items-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
