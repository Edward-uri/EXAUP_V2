import type { Encuesta } from '../../domain/Encuesta';
import {
    TrashIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { fechaRelativa } from '../../../../core/fechas';

interface EncuestasTableProps {
    encuestas: Encuesta[];
    onDelete: (id: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
    onViewMetrics?: (id: string) => void;
    onGestionar?: (id: string) => void;
    /** Id de la encuesta cuyo cambio de estado está en vuelo. */
    togglingId?: string | null;
}

export function EncuestasTable({ encuestas, onDelete, onToggleActive, onViewMetrics, onGestionar, togglingId }: EncuestasTableProps) {
    
    if (encuestas.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No hay encuestas creadas aún</p>
            </div>
        );
    }


    return (
        <div className="overflow-hidden shadow ring-1 ring-gray-300 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nombre
                        </th>
                        <th className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Descripción
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Estado
                        </th>
                        <th className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Creada
                        </th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {encuestas.map((encuesta) => (
                        <tr key={encuesta.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {encuesta.attributes.nombre}
                            </td>
                            <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {encuesta.attributes.descripcion || '-'}
                            </td>
                            {/* Interruptor, no badge: antes el estado se veía igual que
                                cualquier etiqueta de solo lectura y nadie sabía que
                                era clickeable. */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <div className="flex items-center gap-2.5">
                                    <Switch
                                        checked={encuesta.attributes.is_active}
                                        onChange={() => onToggleActive(encuesta.id, encuesta.attributes.is_active)}
                                        disabled={togglingId === encuesta.id}
                                        title={
                                            encuesta.attributes.is_active
                                                ? 'Desactivar: dejará de recibir respuestas'
                                                : 'Activar: volverá a recibir respuestas'
                                        }
                                        className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-gray-300 p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 data-checked:bg-emerald-600 data-disabled:cursor-wait data-disabled:opacity-60"
                                    >
                                        <span className="sr-only">
                                            {encuesta.attributes.is_active ? 'Desactivar encuesta' : 'Activar encuesta'}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none size-4 rounded-full bg-white shadow ring-0 transition-transform duration-200 group-data-checked:translate-x-4"
                                        />
                                    </Switch>
                                    <span
                                        className={`text-xs font-medium ${
                                            encuesta.attributes.is_active ? 'text-emerald-700' : 'text-gray-500'
                                        }`}
                                    >
                                        {encuesta.attributes.is_active ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                            </td>
                            <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {fechaRelativa(encuesta.attributes.created_at)}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex items-center justify-end gap-2">
                                    {onGestionar && (
                                        <button
                                            onClick={() => onGestionar(encuesta.id)}
                                            className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Gestionar encuesta"
                                        >
                                            <Cog6ToothIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onViewMetrics && (
                                        <button
                                            onClick={() => onViewMetrics(encuesta.id)}
                                            className="text-green-600 hover:text-green-900 p-1.5 hover:bg-green-50 rounded-md transition-colors"
                                            title="Ver métricas"
                                        >
                                            <ChartBarIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(encuesta.id)}
                                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
