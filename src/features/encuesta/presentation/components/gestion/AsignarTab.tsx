import { useEffect, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { AsignacionService } from '../../../data/GestionEncuestaService';
import type { GrupoAsignado } from '../../../domain/GestionEncuesta';

interface AsignarTabProps {
    encuestaId: string;
    refreshKey: number;
    onAsignarClick: () => void;
}

export function AsignarTab({ encuestaId, refreshKey, onAsignarClick }: AsignarTabProps) {
    // null = todavía cargando
    const [grupos, setGrupos] = useState<GrupoAsignado[] | null>(null);

    useEffect(() => {
        let vigente = true;
        AsignacionService.gruposAsignados(encuestaId)
            .then(data => { if (vigente) setGrupos(data); })
            .catch(() => { if (vigente) setGrupos([]); });
        return () => { vigente = false; };
    }, [encuestaId, refreshKey]);

    return (
        <div className="space-y-6">
            {/* F8: grupos que realmente se asignaron a la encuesta (B12) */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Grupos asignados</h3>
                {grupos === null ? (
                    <p className="text-sm text-gray-500">Cargando…</p>
                ) : grupos.length === 0 ? (
                    <p className="text-sm text-gray-500">Esta encuesta todavía no tiene grupos asignados.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {grupos.map(g => (
                            <li key={g.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{g.attributes.nombre}</p>
                                    <p className="text-xs text-gray-500">
                                        {Number(g.attributes.cantidad_participantes)} participantes activos
                                    </p>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="rounded-full bg-green-100 px-2.5 py-1 font-medium text-green-800">
                                        {Number(g.attributes.estado_respuesta.contestadas)} contestadas
                                    </span>
                                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 font-medium text-yellow-800">
                                        {Number(g.attributes.estado_respuesta.pendientes)} pendientes
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
                <div className="text-center max-w-md mx-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                        <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Asignar Grupos de Egresados
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Asigna grupos de egresados que podrán contestar esta encuesta.
                        Los miembros del grupo recibirán acceso automáticamente.
                    </p>
                    <button
                        onClick={onAsignarClick}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <UserGroupIcon className="w-5 h-5" />
                        Asignar Grupo
                    </button>
                </div>
            </div>
        </div>
    );
}