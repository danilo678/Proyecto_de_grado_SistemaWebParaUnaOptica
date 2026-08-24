import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { capitalizar } from '../../utils/format';
import { Cliente, PaginatedResponse } from '../../types';
import { Plus, Pencil, Trash2, Search, X, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/;

const schema = z.object({
  ci: z.string().regex(/^\d{6,15}$/, 'El CI debe tener entre 6 y 15 números'),
  nombre: z.string().min(1, 'Nombre requerido').regex(SOLO_LETRAS, 'El nombre solo acepta letras'),
  apellido: z.string().refine((v) => v === '' || SOLO_LETRAS.test(v), 'El apellido solo acepta letras').optional(),
  telefono: z.string().refine((v) => v === '' || /^\d{6,15}$/.test(v), 'El teléfono debe tener entre 6 y 15 números').optional(),
  sexo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ClientsPage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Cliente>>({
    queryKey: ['clients', page, search],
    queryFn: async () => {
      const res = await api.get('/clients', { params: { page, limit: 10, search } });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (dto: FormData) => api.post('/clients', dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['clients'] }); toast.success('Cliente creado'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...dto }: any) => api.put(`/clients/${id}`, dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['clients'] }); toast.success('Cliente actualizado'); closeModal(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/clients/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['clients'] }); toast.success('Cliente eliminado'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error'),
  });

  const openCreate = () => { setEditing(null); reset({ ci: '', nombre: '', apellido: '', telefono: '', sexo: '' }); setShowModal(true); };
  const openEdit = (c: Cliente) => { setEditing(c); reset({ ci: c.ci, nombre: c.nombre, apellido: c.apellido, telefono: c.telefono || '', sexo: c.sexo || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset(); };

  const onSubmit = (fd: FormData) => {
    const datos = { ...fd, nombre: capitalizar(fd.nombre), apellido: capitalizar(fd.apellido) };
    if (editing) updateMutation.mutate({ id: editing.id, ...datos });
    else createMutation.mutate(datos);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-7 h-7 text-emerald-500" /> Gestión de Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">Administrar clientes de la óptica</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre o CI..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">CI</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Teléfono</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Sexo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Registro</th>
                {isAdmin && <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{c.id}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{c.ci}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{c.nombre} {c.apellido}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.telefono || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.sexo === 'M' ? 'Masculino' : c.sexo === 'F' ? 'Femenino' : '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(c.fechaRegistro).toLocaleDateString('es-BO')}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(c)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(c.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron clientes</td></tr>
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CI *</label>
                  <input {...register('ci', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ''); } })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" inputMode="numeric" />
                  {errors.ci && <p className="text-red-500 text-xs mt-1">{errors.ci.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input {...register('nombre')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                  <input {...register('apellido')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input {...register('telefono', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ''); } })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                <select {...register('sexo')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
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
