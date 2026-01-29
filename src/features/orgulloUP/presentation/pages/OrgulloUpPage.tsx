import { useState, useEffect } from 'react';
import { OrgulloUPFilter } from '../components/OrgulloUPFilter';
import { OrgulloUPTable } from '../components/OrgulloUPTable';
import { EgresadoDetailModal } from '../components/EgresadoDetailModal';
import { OrgulloUPService } from '../../data/OrgulloUPService';
import type { OrgulloUPRecord, OrgulloUPMeta } from '../../domain/OrgulloUP';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function OrgulloUpPage() {
    const [records, setRecords] = useState<OrgulloUPRecord[]>([]);
    const [meta, setMeta] = useState<OrgulloUPMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'activo' | 'inactivo' | 'pendiente'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedRecord, setSelectedRecord] = useState<OrgulloUPRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cargar datos
    useEffect(() => {
        const loadRecords = async () => {
            try {
                setLoading(true);
                const response = await OrgulloUPService.getAll(currentPage, 10);
                setRecords(response.data);
                setMeta(response.meta);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar los registros');
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        loadRecords();
    }, [currentPage]);

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
    const activeCount = records.filter(r => r.attributes.status === 'activo').length;
    const inactiveCount = records.filter(r => r.attributes.status === 'inactivo').length;
    const pendingCount = records.filter(r => r.attributes.status === 'pendiente').length;

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

    const handleToggleStatus = async (id: string, newStatus: boolean) => {
        try {
            // Actualizar el estado localmente
            setRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === id
                        ? {
                              ...record,
                              attributes: {
                                  ...record.attributes,
                                  status: newStatus ? 'activo' : 'inactivo',
                                  egresado: {
                                      ...record.attributes.egresado,
                                      is_active: newStatus
                                  }
                              }
                          }
                        : record
                )
            );

            // Actualizar el registro seleccionado si es el que se está modificando
            if (selectedRecord?.id === id) {
                setSelectedRecord(prev =>
                    prev
                        ? {
                              ...prev,
                              attributes: {
                                  ...prev.attributes,
                                  status: newStatus ? 'activo' : 'inactivo',
                                  egresado: {
                                      ...prev.attributes.egresado,
                                      is_active: newStatus
                                  }
                              }
                          }
                        : null
                );
            }

            // Aquí puedes agregar la llamada al API cuando esté disponible
            // await OrgulloUPService.updateStatus(id, newStatus);
        } catch (err) {
            console.error('Error al actualizar el estado:', err);
            // Podrías mostrar un toast de error aquí
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
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md hover:-translate-y-0.5 font-semibold text-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nuevo Registro
                    </button>
                </div>

                {/* Filtros */}
                <OrgulloUPFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    totalRecords={records.length}
                    activeCount={activeCount}
                    inactiveCount={inactiveCount}
                    pendingCount={pendingCount}
                />

                {/* Tabla */}
                <OrgulloUPTable
                    records={filteredRecords}
                    meta={meta}
                    onView={handleView}
                    onPageChange={setCurrentPage}
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
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
}
