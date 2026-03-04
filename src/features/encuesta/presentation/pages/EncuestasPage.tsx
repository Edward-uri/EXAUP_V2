import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEncuestasList } from '../hooks/useEncuestasList';
import { EncuestasTable } from '../components/EncuestasTable';
import { ROUTES } from '../../../../constants/routes';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { 
    PlusIcon, 
    FunnelIcon,
    MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { ConnectionErrorPageAlert } from '../../../../shared/components/PageAlert/ConnectionErrorPageAlert';

export default function EncuestasPage() {
    const navigate = useNavigate();
    const { encuestas, loading, error, deleteEncuesta, toggleActive, refetch } = useEncuestasList();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Filtrado
    const filteredEncuestas = encuestas.filter(encuesta => {
        const matchesSearch = encuesta.attributes.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            filterStatus === 'all' ||
            (filterStatus === 'active' && encuesta.attributes.is_active) ||
            (filterStatus === 'inactive' && !encuesta.attributes.is_active);

        return matchesSearch && matchesStatus;
    });

    const handleViewMetrics = (id: string) => {
        navigate(ROUTES.ENCUESTAS_ANALYTICS(id));
    };

    const handleGestionar = (id: string) => {
        navigate(`/encuestas/${id}/gestionar`);
    };

    const handleRequestDelete = (id: string) => {
        setDeleteTargetId(id);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error === 'CONNECTION_ERROR') {
        return <ConnectionErrorPageAlert onRetry={refetch} />;
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-2">Error</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Mis Encuestas
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestiona y monitorea todas tus encuestas activas
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.ENCUESTAS_CREAR)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md hover:-translate-y-0.5 font-semibold text-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nueva Encuesta
                    </button>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        
                        {/* Buscador */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Filtro de Estado */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todas</option>
                                <option value="active">Activas</option>
                                <option value="inactive">Inactivas</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-6 text-sm">
                        <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-2 font-semibold text-gray-900">{encuestas.length}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Activas:</span>
                            <span className="ml-2 font-semibold text-green-600">
                                {encuestas.filter(e => e.attributes.is_active).length}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Inactivas:</span>
                            <span className="ml-2 font-semibold text-gray-600">
                                {encuestas.filter(e => !e.attributes.is_active).length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <EncuestasTable
                    encuestas={filteredEncuestas}
                    onDelete={handleRequestDelete}
                    onToggleActive={toggleActive}
                    onViewMetrics={handleViewMetrics}
                    onGestionar={handleGestionar}
                />

                {/* Empty State si hay filtros activos */}
                {filteredEncuestas.length === 0 && encuestas.length > 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-6">
                        <p className="text-gray-500">
                            No se encontraron encuestas con los filtros aplicados
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('all');
                            }}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Confirmación para eliminar encuesta */}
                <ConfirmModal
                    isOpen={!!deleteTargetId}
                    title="Eliminar encuesta"
                    message="¿Estás seguro de eliminar esta encuesta? Esta acción no se puede deshacer."
                    variant="danger"
                    loading={deleting}
                    onCancel={() => {
                        if (deleting) return;
                        setDeleteTargetId(null);
                    }}
                    onConfirm={async () => {
                        if (!deleteTargetId) return;
                        try {
                            setDeleting(true);
                            await deleteEncuesta(deleteTargetId);
                            setDeleteTargetId(null);
                        } finally {
                            setDeleting(false);
                        }
                    }}
                />
            </div>
        </div>
    );
}
