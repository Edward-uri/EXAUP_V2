import { useEffect, useState, type KeyboardEvent } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { UsuarioService, mensajeDeError } from '../../data/UsuarioService';
import {
    ETIQUETA_ROL,
    type ActualizarUsuarioPayload,
    type RolUsuario,
    type Usuario,
} from '../../domain/Usuario';
import { errorDePassword } from '../../domain/ReglasPassword';

interface UsuarioFormModalProps {
    open: boolean;
    // null = crear un usuario nuevo; con valor = editar ese usuario.
    usuario: Usuario | null;
    // Roles que devuelve el API. Dirección de Vinculación solo recibe el de Director de PE.
    roles: RolUsuario[];
    onClose: () => void;
    onGuardado: () => void;
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CLASE_ETIQUETA = 'mb-1 block text-sm font-medium text-slate-700';
const CLASE_CAMPO =
    'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 ' +
    'focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60';



export function UsuarioFormModal({ open, usuario, roles, onClose, onGuardado }: UsuarioFormModalProps) {
    const editando = usuario !== null;

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idRol, setIdRol] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);

    // Cada vez que se abre, el formulario arranca limpio o con los datos del usuario.
    useEffect(() => {
        if (!open) return;
        setNombre(usuario?.nombre ?? '');
        setEmail(usuario?.email ?? '');
        setPassword('');
        setIdRol(usuario ? String(usuario.id_rol) : roles.length === 1 ? String(roles[0].id_rol) : '');
        setError(null);
        setGuardando(false);
    }, [open, usuario, roles]);

    const guardar = async () => {
        if (guardando) return;

        const nombreLimpio = nombre.trim();
        const emailLimpio = email.trim();

        if (!nombreLimpio) {
            setError('Escribe el nombre.');
            return;
        }
        if (!EMAIL_VALIDO.test(emailLimpio)) {
            setError('Escribe un correo válido.');
            return;
        }
        if (!idRol) {
            setError('Elige un rol.');
            return;
        }
        if (!editando) {
            const falloPassword = errorDePassword(password);
            if (falloPassword) {
                setError(falloPassword);
                return;
            }
        }

        setGuardando(true);
        setError(null);

        try {
            if (usuario) {
                // Solo se envía lo que cambió.
                const cambios: ActualizarUsuarioPayload = {};
                if (nombreLimpio !== usuario.nombre) cambios.nombre = nombreLimpio;
                if (emailLimpio !== usuario.email) cambios.email = emailLimpio;
                if (Number(idRol) !== usuario.id_rol) cambios.id_rol = Number(idRol);

                if (Object.keys(cambios).length === 0) {
                    onClose();
                    return;
                }
                await UsuarioService.update(usuario.id_usuario, cambios);
            } else {
                await UsuarioService.create({
                    nombre: nombreLimpio,
                    email: emailLimpio,
                    password,
                    id_rol: Number(idRol),
                });
            }
            onGuardado();
        } catch (err) {
            setError(
                mensajeDeError(
                    err,
                    editando ? 'No se pudo guardar los cambios.' : 'No se pudo crear el usuario.'
                )
            );
        } finally {
            setGuardando(false);
        }
    };

    const alPresionarTecla = (evento: KeyboardEvent<HTMLDivElement>) => {
        if (evento.key === 'Enter' && (evento.target as HTMLElement).tagName === 'INPUT') {
            evento.preventDefault();
            void guardar();
        }
    };

    const etiquetaDeRol = (nombreRol: string) => ETIQUETA_ROL[nombreRol] ?? nombreRol;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editando ? 'Editar usuario' : 'Nuevo usuario'}
            description={
                editando
                    ? 'Actualiza los datos de la cuenta.'
                    : 'Crea una cuenta de acceso para el personal.'
            }
            size="sm"
            dismissible={!guardando}
            actions={[
                {
                    id: 'cancelar',
                    label: 'Cancelar',
                    variant: 'secondary',
                    onClick: onClose,
                    disabled: guardando,
                },
                {
                    id: 'guardar',
                    label: editando ? 'Guardar cambios' : 'Crear usuario',
                    variant: 'primary',
                    onClick: guardar,
                    loading: guardando,
                },
            ]}
        >
            <div className="space-y-4" onKeyDown={alPresionarTecla}>
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                    >
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="usuario-nombre" className={CLASE_ETIQUETA}>
                        Nombre completo
                    </label>
                    <input
                        id="usuario-nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={guardando}
                        autoComplete="off"
                        className={CLASE_CAMPO}
                    />
                </div>

                <div>
                    <label htmlFor="usuario-email" className={CLASE_ETIQUETA}>
                        Correo institucional
                    </label>
                    <input
                        id="usuario-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={guardando}
                        autoComplete="off"
                        className={CLASE_CAMPO}
                    />
                </div>

                {!editando && (
                    <div>
                        <label htmlFor="usuario-password" className={CLASE_ETIQUETA}>
                            Contraseña inicial
                        </label>
                        <input
                            id="usuario-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={guardando}
                            autoComplete="new-password"
                            className={CLASE_CAMPO}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Mínimo 8 caracteres, con una mayúscula y un número.
                        </p>
                    </div>
                )}

                <div>
                    <label htmlFor="usuario-rol" className={CLASE_ETIQUETA}>
                        Rol
                    </label>
                    <select
                        id="usuario-rol"
                        value={idRol}
                        onChange={(e) => setIdRol(e.target.value)}
                        disabled={guardando || roles.length === 0}
                        className={CLASE_CAMPO}
                    >
                        <option value="">Selecciona un rol</option>
                        {usuario && !roles.some((rol) => rol.id_rol === usuario.id_rol) && (
                            <option value={usuario.id_rol}>{etiquetaDeRol(usuario.rol_nombre)}</option>
                        )}
                        {roles.map((rol) => (
                            <option key={rol.id_rol} value={rol.id_rol}>
                                {etiquetaDeRol(rol.nombre)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
}