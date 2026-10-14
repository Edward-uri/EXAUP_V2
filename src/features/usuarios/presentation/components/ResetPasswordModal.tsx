import { useEffect, useState, type KeyboardEvent } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { UsuarioService, mensajeDeError } from '../../data/UsuarioService';
import type { Usuario } from '../../domain/Usuario';
import { errorDePassword } from '../../domain/ReglasPassword';

interface ResetPasswordModalProps {
    open: boolean;
    usuario: Usuario | null;
    onClose: () => void;
    onGuardado: () => void;
}

export function ResetPasswordModal({ open, usuario, onClose, onGuardado }: ResetPasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);

    // Cada vez que se abre, el campo arranca vacío y sin errores.
    useEffect(() => {
        if (!open) return;
        setPassword('');
        setError(null);
        setGuardando(false);
    }, [open, usuario]);

    const guardar = async () => {
        if (guardando || !usuario) return;

        const falloPassword = errorDePassword(password);
        if (falloPassword) {
            setError(falloPassword);
            return;
        }

        setGuardando(true);
        setError(null);

        try {
            await UsuarioService.resetPassword(usuario.id_usuario, password);
            onGuardado();
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo restablecer la contraseña.'));
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Restablecer contraseña"
            description={usuario ? `Asigna una contraseña nueva a ${usuario.nombre}.` : undefined}
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
                    label: 'Restablecer',
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
                    <label htmlFor="reset-password" className="mb-1 block text-sm font-medium text-slate-700">
                        Contraseña nueva
                    </label>
                    <input
                        id="reset-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={guardando}
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        Mínimo 8 caracteres, con una mayúscula y un número.
                    </p>
                </div>
            </div>
        </Modal>
    );
}