import { useMemo, useState } from 'react';
import { KeyRound, Pencil, Plus, Search, UserCheck, UserX } from 'lucide-react';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { UsuarioService, mensajeDeError } from '../../data/UsuarioService';
import { ETIQUETA_ROL, type Usuario } from '../../domain/Usuario';
import { useUsuariosList } from '../hooks/useUsuariosList';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import { ResetPasswordModal } from '../components/ResetPasswordModal';

export function UsuariosPage() {
    const { usuarios, roles, loading, error, recargar } = useUsuariosList();

    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState<number | ''>('');

    // Ventanas: formulario (crear/editar), contraseña y desactivar
    const [formAbierto, setFormAbierto] = useState(false);
    const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);
    const [usuarioPassword, setUsuarioPassword] = useState<Usuario | null>(null);
    const [usuarioDesactivar, setUsuarioDesactivar] = useState<Usuario | null>(null);

    const [desactivando, setDesactivando] = useState(false);
    const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

    const filtrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return usuarios.filter((u) => {
            if (filtroRol !== '' && u.id_rol !== filtroRol) return false;
            if (!texto) return true;
            return (
                u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto)
            );
        });
    }, [usuarios, busqueda, filtroRol]);

    const abrirCrear = () => {
        setUsuarioEnEdicion(null);
        setFormAbierto(true);
    };

    const abrirEditar = (usuario: Usuario) => {
        setUsuarioEnEdicion(usuario);
        setFormAbierto(true);
    };

    const alGuardarUsuario = () => {
        const fueEdicion = usuarioEnEdicion !== null;
        setFormAbierto(false);
        setUsuarioEnEdicion(null);
        setAviso({
            tipo: 'ok',
            texto: fueEdicion ? 'Usuario actualizado.' : 'Usuario creado.',
        });
        recargar();
    };

    const alGuardarPassword = () => {
        setUsuarioPassword(null);
        setAviso({ tipo: 'ok', texto: 'Contraseña actualizada.' });
    };

    const reactivar = async (usuario: Usuario) => {
        try {
            await UsuarioService.update(usuario.id_usuario, { is_active: true });
            setAviso({ tipo: 'ok', texto: 'Usuario reactivado.' });
            recargar();
        } catch (err) {
            setAviso({
                tipo: 'error',
                texto: mensajeDeError(err, 'No se pudo reactivar el usuario.'),
            });
        }
    };

    const confirmarDesactivar = async () => {
        if (!usuarioDesactivar) return;
        setDesactivando(true);
        try {
            await UsuarioService.deactivate(usuarioDesactivar.id_usuario);
            setAviso({ tipo: 'ok', texto: 'Usuario desactivado.' });
            setUsuarioDesactivar(null);
            recargar();
        } catch (err) {
            setAviso({
                tipo: 'error',
                texto: mensajeDeError(err, 'No se pudo desactivar el usuario.'),
            });
            setUsuarioDesactivar(null);
        } finally {
            setDesactivando(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Usuarios</h1>
                    <p className="text-sm text-slate-500">
                        Administra las cuentas de acceso al sistema.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={abrirCrear}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-800"
                >
                    <Plus size={16} />
                    Nuevo usuario
                </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre o correo"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
                    />
                </div>

                {/* Si solo hay un rol disponible (Vinculación), el filtro no hace falta */}
                {roles.length > 1 && (
                    <select
                        value={filtroRol}
                        onChange={(e) =>
                            setFiltroRol(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
                    >
                        <option value="">Todos los roles</option>
                        {roles.map((rol) => (
                            <option key={rol.id_rol} value={rol.id_rol}>
                                {ETIQUETA_ROL[rol.nombre] ?? rol.nombre}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {aviso && (
                <div
                    className={`rounded-xl px-4 py-3 text-sm ${aviso.tipo === 'ok'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                        }`}
                >
                    {aviso.texto}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-slate-500">Cargando usuarios...</p>
            ) : error ? (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}{' '}
                    <button type="button" onClick={recargar} className="font-medium underline">
                        Reintentar
                    </button>
                </div>
            ) : filtrados.length === 0 ? (
                <p className="text-sm text-slate-500">No hay usuarios que mostrar.</p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nombre</th>
                                <th className="px-4 py-3 font-medium">Correo</th>
                                <th className="px-4 py-3 font-medium">Rol</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtrados.map((u) => (
                                <tr key={u.id_usuario}>
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        {u.nombre}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {ETIQUETA_ROL[u.rol_nombre] ?? u.rol_nombre}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${u.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {u.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => abrirEditar(u)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Cambiar contraseña"
                                                onClick={() => setUsuarioPassword(u)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                            >
                                                <KeyRound size={16} />
                                            </button>
                                            {u.is_active ? (
                                                <button
                                                    type="button"
                                                    title="Desactivar"
                                                    onClick={() => setUsuarioDesactivar(u)}
                                                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    <UserX size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    title="Reactivar"
                                                    onClick={() => reactivar(u)}
                                                    className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <UsuarioFormModal
                open={formAbierto}
                usuario={usuarioEnEdicion}
                roles={roles}
                onClose={() => setFormAbierto(false)}
                onGuardado={alGuardarUsuario}
            />

            <ResetPasswordModal
                open={usuarioPassword !== null}
                usuario={usuarioPassword}
                onClose={() => setUsuarioPassword(null)}
                onGuardado={alGuardarPassword}
            />

            <ConfirmModal
                isOpen={usuarioDesactivar !== null}
                title="Desactivar usuario"
                message={`¿Seguro que quieres desactivar a ${usuarioDesactivar?.nombre ?? ''}? Ya no podrá iniciar sesión.`}
                confirmText="Desactivar"
                variant="danger"
                loading={desactivando}
                onConfirm={confirmarDesactivar}
                onCancel={() => setUsuarioDesactivar(null)}
            />
        </div>
    );
}