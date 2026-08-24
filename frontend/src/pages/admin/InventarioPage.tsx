import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { capitalizar, fmtMoney } from '../../utils/format';
import { Producto, Categoria, PaginatedResponse } from '../../types';
import { Plus, Pencil, Trash2, Search, X, Loader2, Package, AlertTriangle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  categoriaId: z.number().min(1, 'Categoría requerida'),
  codigo: z.string().min(1, 'Código requerido'),
  descripcion: z.string().optional().or(z.literal('')),
  marca: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  precioCompra: z.number().min(0, 'Precio inválido'),
  precioVenta: z.number().min(0, 'Precio inválido'),
  stock: z.number().min(0, 'Stock inválido'),
  stockMinimo: z.number().min(0, 'Stock mínimo inválido'),
});

type FormData = z.infer<typeof schema>;

export default function InventoryPage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<number | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { precioCompra: 0, precioVenta: 0, stock: 0, stockMinimo: 5 },
  });

  const { data: cats } = useQuery<Categoria[]>({
    queryKey: ['categories'],
    queryFn: async () => { const r = await api.get('/categories'); return r.data; },
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Producto>>({
    queryKey: ['products', page, search, catFilter],
    queryFn: async () => {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (catFilter) params.categoriaId = catFilter;
      const res = await api.get('/products', { params });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (dto: FormData) => api.post('/products', dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); toast.success('Producto creado'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...dto }: any) => api.put(`/products/${id}`, dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); toast.success('Producto actualizado'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); toast.success('Producto eliminado'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const openCreate = () => { setEditing(null); reset({ nombre: '', categoriaId: 1, codigo: '', descripcion: '', marca: '', color: '', precioCompra: 0, precioVenta: 0, stock: 0, stockMinimo: 5 }); setShowModal(true); };
  const openEdit = (p: Producto) => { setEditing(p); reset({ nombre: p.nombre, categoriaId: p.categoriaId, codigo: p.codigo || '', descripcion: p.descripcion || '', marca: p.marca || '', color: p.color || '', precioCompra: p.precioCompra, precioVenta: p.precioVenta, stock: p.stock, stockMinimo: p.stockMinimo }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset(); };

  const onSubmit = (fd: FormData) => {
    const datos = {
      ...fd,
      nombre: capitalizar(fd.nombre),
      marca: capitalizar(fd.marca),
      color: capitalizar(fd.color),
      descripcion: capitalizar(fd.descripcion),
    };
    if (editing) updateMutation.mutate({ id: editing.id, ...datos });
    else createMutation.mutate(datos);
  };

  const imprimirProductos = async () => {
    const res = await api.get('/products', { params: { limit: 9999 } });
    const productos: Producto[] = res.data.data;

    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(55, 55, 55);
    doc.text('Reporte de Stock', 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}   ·   Total de productos: ${productos.length}`, 14, 26);

    doc.setDrawColor(210, 210, 210);
    doc.line(14, 30, 196, 30);

    autoTable(doc, {
      startY: 36,
      head: [['Producto', 'Stock']],
      body: productos.map((p) => [p.nombre, String(p.stock)]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 9.5,
        textColor: [75, 75, 75],
        cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
      },
      headStyles: {
        fillColor: [242, 242, 242],
        textColor: [90, 90, 90],
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right', cellWidth: 28 },
      },
      didParseCell: (data: any) => {
        if (data.section === 'body') {
          const p = productos[data.row.index];
          if (p && p.stock <= p.stockMinimo && data.column.index === 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [40, 40, 40];
          }
        }
      },
    });

    doc.save('productos_stock.pdf');
    toast.success('PDF generado correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Package className="w-7 h-7 text-emerald-500" /> Productos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestionar productos y stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={imprimirProductos} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Imprimir Stock
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" /> Nuevo Producto
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre, código o marca..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Todas las categorías</option>
            {cats?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Código</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Marca</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">P. Compra</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">P. Venta</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                {isAdmin && <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.codigo || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{p.nombre}</div>
                      {p.color && <div className="text-xs text-slate-400">{p.color}</div>}
                    </td>
                    <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{p.categoria?.nombre}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.marca || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">Bs. {fmtMoney(p.precioCompra)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 text-right">Bs. {fmtMoney(p.precioVenta)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${p.stock <= p.stockMinimo ? 'text-red-600' : 'text-slate-700'}`}>
                        {p.stock <= p.stockMinimo && <AlertTriangle className="w-3.5 h-3.5" />}
                        {p.stock}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(p.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron productos</td></tr>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input {...register('nombre')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                  <select {...register('categoriaId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {cats?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
                  <input {...register('codigo')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input {...register('marca')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <input {...register('color')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Compra *</label>
                  <input type="number" step="0.01" {...register('precioCompra', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Venta *</label>
                  <input type="number" step="0.01" {...register('precioVenta', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
                  <input type="number" {...register('stock', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
                  <input type="number" {...register('stockMinimo', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <textarea {...register('descripcion')} rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
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
