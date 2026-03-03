import { useState } from 'react';
import { OrgulloUPFilter } from '../components/OrgulloUPFilter';
import { OrgulloUPTable } from '../components/OrgulloUPTable';
import { EgresadoDetailModal } from '../components/EgresadoDetailModal';
import { useOrgulloUPList } from '../hooks/useOrgulloUPList';
import { useOrgulloUPDetail } from '../hooks/useOrgulloUPDetail';
import type { OrgulloUPRecord } from '../../domain/OrgulloUP';
import { Pagination } from '../../../../shared/components/Pagination';

export default function OrgulloUpPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'rechazado' | 'aprobado'>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const ITEMS_PER_PAGE = 10;

    const { records, meta, loading, error, refetch } = useOrgulloUPList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        searchTerm,
    });


    const [selectedRecord, setSelectedRecord] = useState<OrgulloUPRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        sinopsis,
        logrosAcademicos,
        logrosLaborales,
        loading: detailLoading,
    } = useOrgulloUPDetail({
        id: selectedRecord?.id ?? null,
        isOpen: isModalOpen,
    });

    // Filtrado
    const filteredRecords = records.filter(record => {
        const { egresado, status } = record.attributes;
        const matchesStatus =
            filterStatus === 'all' ||
            status === filterStatus;

        return matchesStatus;
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

    const isInitialLoading = loading && !records.length && !searchTerm;

    if (isInitialLoading) {
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
                    totalRecords={meta?.total_records ?? records.length}
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

                {/* Paginación backend */}
                {meta && meta.total_records > 0 && (
                    <Pagination
                        currentPage={meta.page}
                        totalPages={Math.max(1, Math.ceil(meta.total_records / meta.limit))}
                        totalItems={meta.total_records}
                        itemsPerPage={meta.limit}
                        onPageChange={(page) => {
                            const totalPages = Math.max(1, Math.ceil(meta.total_records / meta.limit));
                            if (page < 1 || page > totalPages) return;
                            setCurrentPage(page);
                        }}
                    />
                )}

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
                sinopsis={sinopsis}
                loadingSinopsis={detailLoading}
                logrosAcademicos={logrosAcademicos}
                logrosLaborales={logrosLaborales}
                loadingLogros={detailLoading}
            />
        </div>
    );
}
