import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { capitalizar } from '../../utils/format';
import { Receta, Cliente, PaginatedResponse } from '../../types';
import { Plus, Pencil, Trash2, Search, X, Loader2, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  clienteId: z.number().min(1, 'Cliente requerido'),
  clinicaExterna: z.string().optional(),
  esferaOd: z.number().optional(),
  cilindroOd: z.number().optional(),
  ejeOd: z.number().optional(),
  addOd: z.number().optional(),
  dpOd: z.number().optional(),
  esferaOs: z.number().optional(),
  cilindroOs: z.number().optional(),
  ejeOs: z.number().optional(),
  addOs: z.number().optional(),
  dpOs: z.number().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PrescriptionsPage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState<Receta | null>(null);
  const [editing, setEditing] = useState<Receta | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: clients } = useQuery<PaginatedResponse<Cliente>>({
    queryKey: ['clients-all'],
    queryFn: async () => { const r = await api.get('/clients', { params: { limit: 100 } }); return r.data; },
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Receta>>({
    queryKey: ['prescriptions', page],
    queryFn: async () => { const res = await api.get('/prescriptions', { params: { page, limit: 10 } }); return res.data; },
  });

  const createMutation = useMutation({
    mutationFn: (dto: FormData) => api.post('/prescriptions', dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prescriptions'] }); toast.success('Receta creada'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...dto }: any) => api.put(`/prescriptions/${id}`, dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prescriptions'] }); toast.success('Receta actualizada'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/prescriptions/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prescriptions'] }); toast.success('Receta eliminada'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const openCreate = () => { setEditing(null); reset({ clienteId: 0, clinicaExterna: '', observaciones: '' }); setShowModal(true); };
  const openEdit = (r: Receta) => { setEditing(r); reset({ clienteId: r.clienteId, clinicaExterna: r.clinicaExterna || '', esferaOd: r.esferaOd || undefined, cilindroOd: r.cilindroOd || undefined, ejeOd: r.ejeOd || undefined, addOd: r.addOd || undefined, dpOd: r.dpOd || undefined, esferaOs: r.esferaOs || undefined, cilindroOs: r.cilindroOs || undefined, ejeOs: r.ejeOs || undefined, addOs: r.addOs || undefined, dpOs: r.dpOs || undefined, observaciones: r.observaciones || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset(); };

  const onSubmit = (fd: FormData) => {
    const datos = {
      ...fd,
      clinicaExterna: capitalizar(fd.clinicaExterna),
      observaciones: capitalizar(fd.observaciones),
    };
    if (editing) updateMutation.mutate({ id: editing.id, ...datos });
    else createMutation.mutate(datos);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-7 h-7 text-emerald-500" /> Recetas / Prescripciones</h1>
          <p className="text-slate-500 text-sm mt-1">Gestionar prescripciones ópticas de clientes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nueva Receta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Clínica</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">OD</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase">OS</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{r.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{r.cliente?.nombre} {r.cliente?.apellido}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(r.fecha).toLocaleDateString('es-BO')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{r.clinicaExterna || '-'}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-600">E:{r.esferaOd || '-'} C:{r.cilindroOd || '-'}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-600">E:{r.esferaOs || '-'} C:{r.cilindroOs || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewModal(r)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEdit(r)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(r.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron recetas</td></tr>
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

      {/* Modal de vista detallada */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Detalle de Receta #{viewModal.id}</h2>
              <button onClick={() => setViewModal(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 uppercase">Cliente</p><p className="text-sm font-medium text-slate-800">{viewModal.cliente?.nombre} {viewModal.cliente?.apellido}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Fecha</p><p className="text-sm font-medium text-slate-800">{new Date(viewModal.fecha).toLocaleDateString('es-BO')}</p></div>
                <div><p className="text-xs text-slate-400 uppercase">Clínica Externa</p><p className="text-sm text-slate-800">{viewModal.clinicaExterna || '-'}</p></div>
              </div>
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase text-left w-1/6">Ojo</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Esfera</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Cilindro</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Eje</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">A.V.</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">D.I.P.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 font-bold text-blue-600">OD</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.esferaOd || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.cilindroOd || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.ejeOd || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.addOd || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.dpOd || '-'}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 font-bold text-green-600">DI</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.esferaOs || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.cilindroOs || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.ejeOs || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.addOs || '-'}</td>
                      <td className="px-3 py-2 text-center font-medium">{viewModal.dpOs || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {viewModal.observaciones && (
                <div><p className="text-xs text-slate-400 uppercase mb-1">Observaciones</p><p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{viewModal.observaciones}</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Editar Receta' : 'Nueva Receta'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                  <select {...register('clienteId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value={0}>Seleccionar cliente</option>
                    {clients?.data?.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.apellido} - CI: {c.ci}</option>)}
                  </select>
                  {errors.clienteId && <p className="text-red-500 text-xs mt-1">{errors.clienteId.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clínica Externa</label>
                  <input {...register('clinicaExterna')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase text-left w-1/6">Ojo</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Esfera</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Cilindro</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">Eje</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">A.V.</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase text-center">D.I.P.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 font-bold text-blue-600">OD</td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('esferaOd', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('cilindroOd', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="1" {...register('ejeOd', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('addOd', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.5" {...register('dpOd', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2.5 font-bold text-green-600">DI</td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('esferaOs', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('cilindroOs', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="1" {...register('ejeOs', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.25" {...register('addOs', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                      <td className="px-3 py-2"><input type="number" step="0.5" {...register('dpOs', { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea {...register('observaciones')} rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
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
