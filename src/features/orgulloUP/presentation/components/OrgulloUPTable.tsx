import type { OrgulloUPRecord, OrgulloUPMeta } from '../../domain/OrgulloUP';
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface OrgulloUPTableProps {
    records: OrgulloUPRecord[];
    meta: OrgulloUPMeta | null;
    onView?: (id: string) => void;
    onPageChange?: (page: number) => void;
}

export function OrgulloUPTable({ records, meta, onView, onPageChange }: OrgulloUPTableProps) {
    
    if (records.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No hay registros disponibles</p>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'activo':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>;
            case 'inactivo':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactivo</span>;
            case 'pendiente':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
            default:
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <>
            <div className="overflow-hidden shadow ring-1 ring-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Nombre
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Matrícula
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Período
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Email
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Programa Educativo
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {records.map((record) => {
                            const { egresado, status } = record.attributes;
                            const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido || ''}`.trim();
                            
                            return (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {nombreCompleto}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                                        {egresado.matricula || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {egresado.id_periodo || '-'}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {egresado.email || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {egresado.id_programa_educativo || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        {getStatusBadge(status)}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        {onView && (
                                            <button
                                                onClick={() => onView(record.id)}
                                                className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Ver detalles"
                                            >
                                                <EyeIcon className="w-4 h-4" />
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
