import type { Encuesta } from '../../domain/Encuesta';
import { 
    TrashIcon, 
    CheckCircleIcon,
    XCircleIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface EncuestasTableProps {
    encuestas: Encuesta[];
    onDelete: (id: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
    onViewMetrics?: (id: string) => void;
    onGestionar?: (id: string) => void;
}

export function EncuestasTable({ encuestas, onDelete, onToggleActive, onViewMetrics, onGestionar }: EncuestasTableProps) {
    
    if (encuestas.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No hay encuestas creadas aún</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { 
                addSuffix: true, 
                locale: es 
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="overflow-hidden shadow ring-1 ring-gray-300 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nombre
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Descripción
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Estado
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
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
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {encuesta.attributes.nombre}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {encuesta.attributes.descripcion || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <button
                                    onClick={() => onToggleActive(encuesta.id, encuesta.attributes.is_active)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                        encuesta.attributes.is_active
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    {encuesta.attributes.is_active ? (
                                        <>
                                            <CheckCircleIcon className="w-3.5 h-3.5" />
                                            Activa
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="w-3.5 h-3.5" />
                                            Inactiva
                                        </>
                                    )}
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatDate(encuesta.attributes.created_at)}
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
