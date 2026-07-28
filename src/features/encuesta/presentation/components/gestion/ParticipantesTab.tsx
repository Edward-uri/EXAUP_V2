import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ParticipantesTable } from '../ParticipantesTable';
import type { Participante, ParticipantesMeta } from '../../../domain/GestionEncuesta';

interface ParticipantesTabProps {
    participantes: Participante[];
    participantesMeta: ParticipantesMeta | null;
    loading: boolean;
    onRevocar: (uuid: string) => void;
    onPageChange: (page: number) => void;
    onFiltersChange: (filters: {
        searchTerm: string;
        filterAcceso: 'todos' | 'activos' | 'revocados';
        filterEstado: 'all' | 'pendiente' | 'contestada';
    }) => void;
}

export function ParticipantesTab({
    participantes,
    participantesMeta,
    loading,
    onRevocar,
    onPageChange,
    onFiltersChange
}: ParticipantesTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAcceso, setFilterAcceso] = useState<'todos' | 'activos' | 'revocados'>('activos');
    const [filterEstado, setFilterEstado] = useState<'all' | 'pendiente' | 'contestada'>('all');

    const handleFilterChange = (
        field: 'searchTerm' | 'filterAcceso' | 'filterEstado',
        value: string
    ) => {
        const newFilters = {
            searchTerm,
            filterAcceso,
            filterEstado
        };

        if (field === 'searchTerm') {
            setSearchTerm(value);
            newFilters.searchTerm = value;
        } else if (field === 'filterAcceso') {
            const newValue = value as typeof filterAcceso;
            setFilterAcceso(newValue);
            newFilters.filterAcceso = newValue;
        } else if (field === 'filterEstado') {
            const newValue = value as typeof filterEstado;
            setFilterEstado(newValue);
            newFilters.filterEstado = newValue;
        }

        onFiltersChange(newFilters);
    };

    const stats = participantesMeta ? {
        total: participantesMeta.total_records,
        activos: participantes.filter(p => p.attributes.is_active).length,
        contestadas: participantes.filter(p => p.attributes.estado_respuesta === 'contestada').length,
    } : null;

    return (
        <div>
            {/* Filtros */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, matrícula o email..."
                            value={searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterAcceso}
                            onChange={(e) => handleFilterChange('filterAcceso', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="todos">Todos</option>
                            <option value="activos">Activos</option>
                            <option value="revocados">Revocados</option>
                        </select>
                        <select
                            value={filterEstado}
                            onChange={(e) => handleFilterChange('filterEstado', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="contestada">Contestadas</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="mt-4 flex gap-6 text-sm border-t border-gray-200 pt-4">
                        <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-2 font-semibold text-gray-900">{stats.total}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Activos:</span>
                            <span className="ml-2 font-semibold text-blue-600">{stats.activos}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Contestadas:</span>
                            <span className="ml-2 font-semibold text-green-600">{stats.contestadas}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="flex justify-center py-12 bg-white rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <ParticipantesTable
                    participantes={participantes}
                    onRevocar={onRevocar}
                    meta={participantesMeta}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
