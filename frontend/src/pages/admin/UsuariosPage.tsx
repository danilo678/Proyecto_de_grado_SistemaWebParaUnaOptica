import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { capitalizar } from '../../utils/format';
import { Usuario, PaginatedResponse } from '../../types';
import { Plus, Pencil, Trash2, Search, X, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/;

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').regex(SOLO_LETRAS, 'El nombre solo acepta letras'),
  apellido: z.string().refine((v) => v === '' || SOLO_LETRAS.test(v), 'El apellido solo acepta letras').optional(),
  ci: z.string().regex(/^\d{6,15}$/, 'El CI debe tener entre 6 y 15 números'),
  usuario: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-zA-Z0-9._]+$/, 'Solo letras, números, punto y guion bajo'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  telefono: z.string().refine((v) => v === '' || /^\d{6,15}$/.test(v), 'El teléfono debe tener entre 6 y 15 números').optional(),
  direccion: z.string().optional().or(z.literal('')),
  rolId: z.number().min(1, 'Rol requerido'),
});

type FormData = z.infer<typeof schema>;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Usuario>>({
    queryKey: ['users', page, search],
    queryFn: async () => {
      const res = await api.get('/users', { params: { page, limit: 10, search } });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (dto: FormData) => {
      if (!dto.password) delete dto.password;
      return api.post('/users', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado correctamente');
      closeModal();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al crear'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...dto }: any) => {
      if (!dto.password) delete dto.password;
      return api.put(`/users/${id}`, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado correctamente');
      closeModal();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al eliminar'),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ nombre: '', apellido: '', ci: '', usuario: '', password: '', telefono: '', direccion: '', rolId: 2 });
    setShowModal(true);
  };

  const openEdit = (u: Usuario) => {
    setEditing(u);
    reset({ nombre: u.nombre, apellido: u.apellido || '', ci: u.ci || '', usuario: u.usuario, password: '', telefono: u.telefono || '', direccion: u.direccion || '', rolId: u.rolId });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); reset(); };

  const onSubmit = (formData: FormData) => {
    const datos = {
      ...formData,
      nombre: capitalizar(formData.nombre),
      apellido: capitalizar(formData.apellido),
      direccion: capitalizar(formData.direccion),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...datos });
    } else {
      createMutation.mutate(datos);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-7 h-7 text-emerald-500" /> Gestión de Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">Administrar usuarios del sistema</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o CI..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Usuario</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">CI</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Teléfono</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Rol</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{u.nombre} {u.apellido}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.usuario}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.ci}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.telefono || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${u.rol?.nombre === 'Administrador' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.rol?.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('¿Eliminar este usuario?')) deleteMutation.mutate(u.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, data.total)} de {data.total}</p>
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
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input {...register('nombre')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                  <input {...register('apellido')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CI *</label>
                  <input {...register('ci', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ''); } })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" inputMode="numeric" />
                  {errors.ci && <p className="text-red-500 text-xs mt-1">{errors.ci.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario *</label>
                  <input {...register('usuario')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{editing ? 'Nueva Contraseña' : 'Contraseña *'}</label>
                  <input type="password" {...register('password')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input {...register('telefono', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ''); } })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" inputMode="numeric" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rol *</label>
                  <select {...register('rolId', { valueAsNumber: true })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value={1}>Administrador</option>
                    <option value={2}>Vendedor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                  <input {...register('direccion')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
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
