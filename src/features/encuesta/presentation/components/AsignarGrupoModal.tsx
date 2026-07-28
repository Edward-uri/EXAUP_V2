import { useState, useEffect } from 'react';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { GrupoService, AsignacionService, ParticipanteService } from '../../data/GestionEncuestaService';
import type { Grupo } from '../../domain/GestionEncuesta';
import { useAlert } from '../../../../shared/components/Alert';

interface AsignarGrupoModalProps {
    isOpen: boolean;
    onClose: () => void;
    encuestaId: string;
    onSuccess: () => void;
    onGrupoChange?: (grupoId: string) => void;
}

export function AsignarGrupoModal({ isOpen, onClose, encuestaId, onSuccess, onGrupoChange }: AsignarGrupoModalProps) {
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [selectedGrupoId, setSelectedGrupoId] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    // true = dejar sólo al grupo nuevo. false = sumarlo a los que ya están.
    const [reemplazar, setReemplazar] = useState(true);
    const [yaAsignados, setYaAsignados] = useState<number | null>(null);
    const alert = useAlert();

    useEffect(() => {
        if (isOpen) {
            loadGrupos();
            // Saber a cuántos afecta la operación antes de ejecutarla.
            ParticipanteService.getParticipantes(encuestaId, { filtro_acceso: 'activos', limit: 1 })
                .then(r => setYaAsignados(r.meta.total_records))
                .catch(() => setYaAsignados(null));
        }
    }, [isOpen, encuestaId]);

    const loadGrupos = async () => {
        setLoading(true);
        try {
            const data = await GrupoService.getAll();
            setGrupos(data);
        } catch (error) {
            console.error('Error cargando grupos:', error);
            alert.error('Error al cargar', 'Error al cargar los grupos.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGrupoId) return;

        setSubmitting(true);
        try {
            if (reemplazar) {
                const r = await AsignacionService.reemplazarPorGrupo(encuestaId, selectedGrupoId);
                alert.success(
                    'Grupo reemplazado',
                    `Se quitaron ${r.revocados} participantes anteriores y se asignaron ${r.meta.created + r.meta.reactivated} del grupo nuevo.`
                );
            } else {
                const r = await AsignacionService.asignarPorGrupo(encuestaId, selectedGrupoId);
                alert.success(
                    'Grupo agregado',
                    `Nuevos: ${r.meta.created} · Reactivados: ${r.meta.reactivated} · Ya estaban: ${r.meta.skipped}`
                );
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error asignando grupo:', error);
            alert.error(
                'Error al asignar',
                reemplazar
                    ? 'La operación falló a media ejecución. Revisa la lista de participantes antes de reintentar.'
                    : 'Error al asignar el grupo.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
                    <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                                        Asignar Grupo de Egresados
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Selecciona un grupo para asignar todos sus miembros a esta encuesta
                                    </p>
                                    
                                    <div className="mt-4">
                                        {loading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Grupo <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={selectedGrupoId}
                                                    onChange={(e) => {
                                                        const grupoId = e.target.value;
                                                        setSelectedGrupoId(grupoId);
                                                        onGrupoChange?.(grupoId);
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                                    required
                                                >
                                                    <option value="">Selecciona un grupo...</option>
                                                    {grupos.map((grupo) => (
                                                        <option key={grupo.id} value={grupo.id}>
                                                            {grupo.attributes.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedGrupoId && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        {grupos.find(g => g.id === selectedGrupoId)?.attributes.descripcion}
                                                    </p>
                                                )}

                                                {/* Sin esto la asignación era siempre aditiva y en silencio:
                                                    el segundo grupo se sumaba al primero. */}
                                                {!!yaAsignados && (
                                                    <fieldset className="mt-5 space-y-2">
                                                        <legend className="mb-2 text-sm font-medium text-gray-700">
                                                            Esta encuesta ya tiene {yaAsignados} participante{yaAsignados === 1 ? '' : 's'}. ¿Qué hago con ellos?
                                                        </legend>
                                                        {[
                                                            { v: true, t: 'Dejar sólo el grupo nuevo', d: 'Quita a los participantes actuales y asigna los del grupo seleccionado.' },
                                                            { v: false, t: 'Sumar al grupo nuevo', d: 'Conserva a los actuales y agrega los del grupo seleccionado.' },
                                                        ].map(op => (
                                                            <label
                                                                key={String(op.v)}
                                                                className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
                                                                    reemplazar === op.v
                                                                        ? 'border-blue-600 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="modo-asignacion"
                                                                    checked={reemplazar === op.v}
                                                                    onChange={() => setReemplazar(op.v)}
                                                                    className="mt-0.5 size-4 shrink-0 text-blue-600 focus:ring-blue-600"
                                                                />
                                                                <span>
                                                                    <span className="block text-sm font-medium text-gray-900">{op.t}</span>
                                                                    <span className="block text-xs text-gray-500">{op.d}</span>
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </fieldset>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                            <button
                                type="submit"
                                disabled={submitting || !selectedGrupoId}
                                className="inline-flex w-full justify-center rounded-md bg-blue-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-auto"
                            >
                                {submitting
                                    ? (reemplazar && yaAsignados ? 'Reemplazando…' : 'Asignando…')
                                    : (reemplazar && yaAsignados ? 'Reemplazar grupo' : 'Asignar grupo')}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
