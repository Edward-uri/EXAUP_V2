import { useState } from 'react';
import { OrgulloUPFilter } from '../components/OrgulloUPFilter';
import { OrgulloUPTable } from '../components/OrgulloUPTable';
import { EgresadoDetailModal } from '../components/EgresadoDetailModal';
import { useOrgulloUPList } from '../hooks/useOrgulloUPList';

export default function OrgulloUpPage() {
    const { records, meta, loading, error, refetch } = useOrgulloUPList();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'rechazado' | 'aprobado'>('all');


    const [selectedRecord, setSelectedRecord] = useState<OrgulloUPRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtrado
    const filteredRecords = records.filter(record => {
        const { egresado, status } = record.attributes;
        const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido || ''}`.toLowerCase();
        const email = (egresado.email || '').toLowerCase();
        
        const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) || 
                             email.includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            filterStatus === 'all' ||
            status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Contar estados
    const pendienteCount = records.filter(r => r.attributes.status === 'pendiente').length;
    const rechazadoCount = records.filter(r => r.attributes.status === 'rechazado').length;
    const aprobadoCount = records.filter(r => r.attributes.status === 'aprobado').length;

    const handleView = (id: string) => {
        const record = records.find(r => r.id === id);
        if (record) {
            setSelectedRecord(record);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const handleUpdateRecord = async () => {
        // Recargar los datos cuando se actualiza un registro
        try {
            await refetch();
        } catch (err) {
            console.error('Error al recargar los registros:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
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
                            Orgullo UP
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestiona los registros de Orgullo UP
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <OrgulloUPFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    totalRecords={records.length}
                    pendienteCount={pendienteCount}
                    rechazadoCount={rechazadoCount}
                    aprobadoCount={aprobadoCount}
                />

                {/* Tabla */}
                <OrgulloUPTable
                    records={filteredRecords}
                    meta={meta}
                    onView={handleView}
                />

                {/* Empty State si hay filtros activos */}
                {filteredRecords.length === 0 && records.length > 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-6">
                        <p className="text-gray-500">
                            No se encontraron registros con los filtros aplicados
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
            </div>

            {/* Modal */}
            <EgresadoDetailModal
                isOpen={isModalOpen}
                record={selectedRecord}
                onClose={handleCloseModal}
                onUpdate={handleUpdateRecord}
            />
        </div>
    );
}
