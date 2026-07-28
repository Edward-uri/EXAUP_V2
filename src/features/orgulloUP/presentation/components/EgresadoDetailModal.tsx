import { useEffect, useState } from 'react';
import {
    BriefcaseIcon,
    CalendarIcon,
    CircleCheckBigIcon,
    CircleXIcon,
    ClockIcon,
    FingerprintIcon,
    GraduationCapIcon,
    IdCardIcon,
    LoaderCircleIcon,
    MailIcon,
    PencilIcon,
    XIcon,
} from 'lucide-react';
import type {
    LogroAcademico,
    LogroLaboral,
    OrgulloUPRecord,
    PerfilActualizable,
} from '../../domain/OrgulloUP';
import { OrgulloUPService } from '../../data/OrgulloUPService';
import { useAlert } from '../../../../shared/components/Alert';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';

interface EgresadoDetailModalProps {
    isOpen: boolean;
    record: OrgulloUPRecord | null;
    onClose: () => void;
    onUpdate?: () => void;
    sinopsis?: string | null;
    loadingSinopsis?: boolean;
    logrosAcademicos?: LogroAcademico[];
    logrosLaborales?: LogroLaboral[];
    loadingLogros?: boolean;
}

type Status = OrgulloUPRecord['attributes']['status'];

/* El backend identifica el estado por número; la UI por nombre. */
const ESTADO_ID: Record<Status, 1 | 2 | 3> = { pendiente: 1, rechazado: 2, aprobado: 3 };

const STATUS_META: Record<Status, {
    label: string;
    badge: string;
    icon: typeof ClockIcon;
    descripcion: string;
}> = {
    pendiente: {
        label: 'Pendiente',
        badge: 'bg-amber-400 text-amber-950',
        icon: ClockIcon,
        descripcion: 'Este perfil aún no ha sido revisado.',
    },
    aprobado: {
        label: 'Aprobado',
        badge: 'bg-emerald-400 text-emerald-950',
        icon: CircleCheckBigIcon,
        descripcion: 'Este perfil es visible en Orgullo UP.',
    },
    rechazado: {
        label: 'Rechazado',
        badge: 'bg-red-500 text-white',
        icon: CircleXIcon,
        descripcion: 'Este perfil no se publica en Orgullo UP.',
    },
};

const formatFecha = (iso: string | null | undefined) =>
    iso
        ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';

function DatoField({ icon: Icon, label, value }: {
    icon: typeof MailIcon;
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="size-4 shrink-0 text-blue-600 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900 break-words">{value || '—'}</p>
            </div>
        </div>
    );
}

function Seccion({ titulo, icon: Icon, count, children }: {
    titulo: string;
    icon?: typeof GraduationCapIcon;
    count?: number;
    children: React.ReactNode;
}) {
    return (
        <section className="border-t border-gray-100 px-6 py-5 sm:px-8">
            <div className="mb-4 flex items-center gap-2">
                {Icon && <Icon className="size-5 text-blue-600" aria-hidden="true" />}
                <h3 className="font-display text-base font-medium text-gray-900">{titulo}</h3>
                {count !== undefined && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        {count}
                    </span>
                )}
            </div>
            {children}
        </section>
    );
}

function Skeleton({ rows = 2 }: { rows?: number }) {
    return (
        <div className="space-y-2" aria-hidden="true">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
        </div>
    );
}

function VacioMsg({ children }: { children: React.ReactNode }) {
    return (
        <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
            {children}
        </p>
    );
}

export function EgresadoDetailModal({
    isOpen,
    record,
    onClose,
    onUpdate,
    sinopsis,
    loadingSinopsis,
    logrosAcademicos,
    logrosLaborales,
    loadingLogros,
}: EgresadoDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<PerfilActualizable | null>(null);
    const [updatedRecord, setUpdatedRecord] = useState<OrgulloUPRecord | null>(null);
    const [imgFallo, setImgFallo] = useState(false);
    const [confirmarRechazo, setConfirmarRechazo] = useState(false);
    const alert = useAlert();

    /* Cada registro arranca limpio: sin overrides, sin modo edición y sin el
       fallo de imagen del egresado anterior. */
    useEffect(() => {
        setUpdatedRecord(null);
        setIsEditing(false);
        setEditData(null);
        setImgFallo(false);
        setConfirmarRechazo(false);
    }, [record?.id]);

    // Esc para cerrar y bloqueo del scroll de fondo mientras el modal está abierto.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSaving) onClose();
        };
        document.addEventListener('keydown', onKey);
        const overflowPrevio = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflowPrevio;
        };
    }, [isOpen, isSaving, onClose]);

    if (!isOpen || !record) return null;

    const currentRecord = updatedRecord || record;
    const { egresado, logros_academicos = [], logros_laborales = [], status } = currentRecord.attributes;
    const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido || ''}`.trim();
    const iniciales = `${egresado.nombre.charAt(0)}${egresado.primer_apellido.charAt(0)}`.toUpperCase();
    const meta = STATUS_META[status] ?? STATUS_META.pendiente;
    const StatusIcon = meta.icon;

    const academicos = logrosAcademicos ?? logros_academicos;
    const laborales = logrosLaborales ?? logros_laborales;

    const startEditing = () => {
        setEditData({
            nombre: egresado.nombre,
            primer_apellido: egresado.primer_apellido,
            segundo_apellido: egresado.segundo_apellido,
            curp: egresado.curp,
            email: egresado.email,
            fecha_nacimiento: egresado.fecha_nacimiento,
            id_programa_educativo: egresado.id_programa_educativo,
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const saveChanges = async () => {
        if (!editData) return;
        setIsSaving(true);
        try {
            await OrgulloUPService.updatePerfil(record.id, editData);
            setUpdatedRecord({
                ...currentRecord,
                attributes: {
                    ...currentRecord.attributes,
                    egresado: { ...currentRecord.attributes.egresado, ...editData },
                },
            });
            setIsEditing(false);
            setEditData(null);
            alert.success('Perfil actualizado', 'Los datos del egresado se han actualizado correctamente.');
            onUpdate?.();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert.error('Error al actualizar', 'No se pudo actualizar el perfil del egresado. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const aplicarEstado = async (nuevo: Status) => {
        setIsSaving(true);
        try {
            await OrgulloUPService.updateEstado(record.id, ESTADO_ID[nuevo]);
            setUpdatedRecord({
                ...currentRecord,
                attributes: { ...currentRecord.attributes, status: nuevo },
            });
            alert.success('Estado actualizado', `El perfil se marcó como "${STATUS_META[nuevo].label}".`);
            onUpdate?.();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert.error('Error al actualizar', 'No se pudo cambiar el estado del egresado. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    /* Rechazar oculta el perfil del sitio público, así que pide confirmación.
       Aprobar y volver a pendiente son reversibles y no la necesitan. */
    const handleEstado = (nuevo: Status) => {
        if (nuevo === status) return;
        if (nuevo === 'rechazado') setConfirmarRechazo(true);
        else void aplicarEstado(nuevo);
    };

    const accionClase = (destino: Status) => {
        if (destino === status) return 'cursor-default border-gray-200 bg-gray-50 text-gray-400';
        if (destino === 'aprobado') return 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700';
        if (destino === 'rechazado') return 'border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300';
        return 'border-amber-200 bg-white text-amber-700 hover:bg-amber-50 hover:border-amber-300';
    };

    const acciones: { destino: Status; label: string; icon: typeof ClockIcon }[] = [
        { destino: 'aprobado', label: 'Aprobar', icon: CircleCheckBigIcon },
        { destino: 'rechazado', label: 'Rechazar', icon: CircleXIcon },
        { destino: 'pendiente', label: 'Dejar pendiente', icon: ClockIcon },
    ];

    const campos: { key: keyof PerfilActualizable; label: string; type?: string }[] = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'primer_apellido', label: 'Primer apellido' },
        { key: 'segundo_apellido', label: 'Segundo apellido' },
        { key: 'curp', label: 'CURP' },
        { key: 'email', label: 'Correo electrónico', type: 'email' },
        { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-blue-950/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-64">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Perfil de ${nombreCompleto}`}
                    className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Encabezado: identidad + estado, siempre visible */}
                    <div className="relative shrink-0 bg-blue-950 px-6 py-6 sm:px-8">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-lg p-2 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Cerrar"
                        >
                            <XIcon className="size-5" />
                        </button>

                        <div className="flex items-center gap-4 pr-10">
                            {egresado.imagen_egresado && !imgFallo ? (
                                <img
                                    src={egresado.imagen_egresado}
                                    alt=""
                                    onError={() => setImgFallo(true)}
                                    className="size-16 shrink-0 rounded-full border-2 border-white/20 object-cover"
                                />
                            ) : (
                                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-turquesa font-display text-xl font-semibold text-blue-950">
                                    {iniciales}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="truncate font-display text-2xl font-semibold text-white">
                                        {nombreCompleto}
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={startEditing}
                                            className="shrink-0 rounded-lg p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
                                            title="Editar datos del egresado"
                                        >
                                            <PencilIcon className="size-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="mt-0.5 truncate text-sm text-blue-200/80">
                                    {egresado.matricula || 'Sin matrícula'}
                                    {egresado.programa_educativo ? ` · ${egresado.programa_educativo}` : ''}
                                </p>
                                <span
                                    className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
                                >
                                    <StatusIcon className="size-3.5" aria-hidden="true" />
                                    {meta.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <>
                            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                                <h3 className="mb-4 font-display text-base font-medium text-gray-900">
                                    Editar datos del egresado
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {campos.map(({ key, label, type }) => (
                                        <div key={key} className={key === 'email' ? 'sm:col-span-2' : ''}>
                                            <label
                                                htmlFor={`campo-${key}`}
                                                className="mb-1 block text-sm font-medium text-gray-700"
                                            >
                                                {label}
                                            </label>
                                            <input
                                                id={`campo-${key}`}
                                                type={type ?? 'text'}
                                                value={(editData?.[key] as string) ?? ''}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, [key]: e.target.value || null })
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
                                <button
                                    onClick={cancelEditing}
                                    disabled={isSaving}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveChanges}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {isSaving && <LoaderCircleIcon className="size-4 animate-spin" />}
                                    {isSaving ? 'Guardando…' : 'Guardar cambios'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Decisión: qué es hoy y qué puedo hacer */}
                            <div className="shrink-0 border-b border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
                                <p className="text-sm text-gray-600">{meta.descripcion}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {acciones.map(({ destino, label, icon: Icon }) => {
                                        const esActual = destino === status;
                                        return (
                                            <button
                                                key={destino}
                                                onClick={() => handleEstado(destino)}
                                                disabled={isSaving || esActual}
                                                aria-current={esActual}
                                                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${accionClase(destino)} ${isSaving && !esActual ? 'opacity-50' : ''}`}
                                            >
                                                <Icon className="size-4" aria-hidden="true" />
                                                {esActual ? `${label} · actual` : label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <Seccion titulo="Datos del egresado">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <DatoField icon={MailIcon} label="Correo" value={egresado.email} />
                                        <DatoField icon={IdCardIcon} label="Matrícula" value={egresado.matricula} />
                                        <DatoField icon={FingerprintIcon} label="CURP" value={egresado.curp} />
                                        <DatoField
                                            icon={GraduationCapIcon}
                                            label="Programa educativo"
                                            value={egresado.programa_educativo}
                                        />
                                        <DatoField
                                            icon={CalendarIcon}
                                            label="Fecha de nacimiento"
                                            value={egresado.fecha_nacimiento ? formatFecha(egresado.fecha_nacimiento) : null}
                                        />
                                        <DatoField
                                            icon={CalendarIcon}
                                            label="Período"
                                            value={egresado.id_periodo ? String(egresado.id_periodo) : null}
                                        />
                                    </div>
                                </Seccion>

                                <Seccion titulo="Sinopsis profesional">
                                    {loadingSinopsis ? (
                                        <Skeleton rows={1} />
                                    ) : sinopsis ? (
                                        <p className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                                            {sinopsis}
                                        </p>
                                    ) : (
                                        <VacioMsg>Sin sinopsis registrada.</VacioMsg>
                                    )}
                                </Seccion>

                                <Seccion
                                    titulo="Logros académicos"
                                    icon={GraduationCapIcon}
                                    count={loadingLogros ? undefined : academicos.length}
                                >
                                    {loadingLogros ? (
                                        <Skeleton />
                                    ) : academicos.length > 0 ? (
                                        <ul className="space-y-2">
                                            {academicos.map((logro) => (
                                                <li
                                                    key={logro.id_academic_achievement}
                                                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                                                >
                                                    <p className="font-medium text-gray-900">{logro.name}</p>
                                                    <p className="mt-0.5 text-sm text-gray-600">{logro.institution}</p>
                                                    <p className="mt-1 text-xs text-gray-400">{formatFecha(logro.date)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <VacioMsg>Sin logros académicos registrados.</VacioMsg>
                                    )}
                                </Seccion>

                                <Seccion
                                    titulo="Logros laborales"
                                    icon={BriefcaseIcon}
                                    count={loadingLogros ? undefined : laborales.length}
                                >
                                    {loadingLogros ? (
                                        <Skeleton />
                                    ) : laborales.length > 0 ? (
                                        <ul className="space-y-2">
                                            {laborales.map((logro) => (
                                                <li
                                                    key={logro.id_labor_achievement}
                                                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                                                >
                                                    <p className="font-medium text-gray-900">{logro.position}</p>
                                                    <p className="mt-0.5 text-sm text-gray-600">{logro.company}</p>
                                                    <p className="mt-1 text-xs text-gray-400">{formatFecha(logro.date)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <VacioMsg>Sin logros laborales registrados.</VacioMsg>
                                    )}
                                </Seccion>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmarRechazo}
                title="¿Rechazar este perfil?"
                message={`${nombreCompleto} dejará de aparecer en Orgullo UP. Puedes revertirlo después.`}
                confirmText="Sí, rechazar"
                variant="danger"
                loading={isSaving}
                onConfirm={async () => {
                    await aplicarEstado('rechazado');
                    setConfirmarRechazo(false);
                }}
                onCancel={() => setConfirmarRechazo(false)}
            />
        </>
    );
}
