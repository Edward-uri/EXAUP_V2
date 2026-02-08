import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface OrgulloUPFilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterStatus: 'all' | 'pendiente' | 'rechazado' | 'aprobado';
    onFilterStatusChange: (status: 'all' | 'pendiente' | 'rechazado' | 'aprobado') => void;
    totalRecords: number;
    pendienteCount: number;
    rechazadoCount: number;
    aprobadoCount: number;
}

export function OrgulloUPFilter({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    totalRecords,
    pendienteCount,
    rechazadoCount,
    aprobadoCount
}: OrgulloUPFilterProps) {
    
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Buscador */}
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Filtro de Estado */}
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value as typeof filterStatus)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="rechazado">Rechazado</option>
                        <option value="aprobado">Aprobado</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6 text-sm">
                <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-semibold text-gray-900">{totalRecords}</span>
                </div>
                <div>
                    <span className="text-gray-500">Pendiente:</span>
                    <span className="ml-2 font-semibold text-yellow-600">{pendienteCount}</span>
                </div>
                <div>
                    <span className="text-gray-500">Rechazado:</span>
                    <span className="ml-2 font-semibold text-red-600">{rechazadoCount}</span>
                </div>
                <div>
                    <span className="text-gray-500">Aprobado:</span>
                    <span className="ml-2 font-semibold text-green-600">{aprobadoCount}</span>
                </div>
            </div>
        </div>
    );
}
