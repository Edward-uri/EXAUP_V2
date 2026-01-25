import type { Participante, ParticipantesMeta } from '../../domain/GestionEncuesta';
import { TrashIcon, CheckCircleIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ParticipantesTableProps {
    participantes: Participante[];
    meta: ParticipantesMeta | null;
    onRevocar: (uuid: string) => void;
    onPageChange?: (page: number) => void;
}

export function ParticipantesTable({ participantes, meta, onRevocar, onPageChange }: ParticipantesTableProps) {
    
    if (participantes.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No hay participantes asignados</p>
                <p className="text-sm text-gray-400 mt-1">Asigna grupos para comenzar</p>
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
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
        <>
            <div className="overflow-hidden shadow ring-1 ring-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Egresado
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Matrícula
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Email
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Estado
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Acceso
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Respuesta
                        </th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {participantes.map((participante) => {
                        const { egresado } = participante.attributes;
                        const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido}`;
                        
                        return (
                            <tr key={participante.id} className="hover:bg-gray-50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {nombreCompleto}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {egresado.matricula}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {egresado.email}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    {participante.attributes.estado_respuesta === 'contestada' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircleIcon className="w-3.5 h-3.5" />
                                            Contestada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        participante.attributes.is_active
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {participante.attributes.is_active ? 'Activo' : 'Revocado'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {formatDate(participante.attributes.fecha_respuesta)}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    {participante.attributes.is_active && (
                                        <button
                                            onClick={() => onRevocar(participante.id)}
                                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                            title="Revocar acceso"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        {/* Paginación */}
        {meta && meta.total_records > meta.limit && onPageChange && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => onPageChange(meta.page - 1)}
                        disabled={meta.page <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => onPageChange(meta.page + 1)}
                        disabled={meta.page * meta.limit >= meta.total_records}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span>
                            {' - '}
                            <span className="font-medium">
                                {Math.min(meta.page * meta.limit, meta.total_records)}
                            </span>
                            {' de '}
                            <span className="font-medium">{meta.total_records}</span>
                            {' resultados'}
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => onPageChange(meta.page - 1)}
                                disabled={meta.page <= 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                Página {meta.page} de {Math.ceil(meta.total_records / meta.limit)}
                            </span>
                            <button
                                onClick={() => onPageChange(meta.page + 1)}
                                disabled={meta.page * meta.limit >= meta.total_records}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
