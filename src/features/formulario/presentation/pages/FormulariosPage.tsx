import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormulariosList } from '../hooks/useFormulariosList';
import { useToast } from '../../../../shared/components/Toast';
import { FormulariosTable } from '../components/FormulariosTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { Pagination } from '../../../../shared/components/Pagination';
import { 
    PlusIcon, 
    DocumentTextIcon, 
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function FormulariosPage() {
    const { formularios, loading, deleteFormulario, toggleFormularioActive, refresh } = useFormulariosList();
    const toast = useToast();
    const navigate = useNavigate();
    
    // Estados para búsqueda y modal
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; titulo: string }>({ open: false, id: '', titulo: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtrar formularios por búsqueda
    const filteredFormularios = useMemo(() => {
        return formularios.filter(f => 
            f.attributes.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.attributes.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [formularios, searchQuery]);

    // Calcular paginación
    const totalPages = Math.ceil(filteredFormularios.length / itemsPerPage);
    const paginatedFormularios = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredFormularios.slice(start, end);
    }, [filteredFormularios, currentPage, itemsPerPage]);

    // Resetear a página 1 cuando cambia la búsqueda o items por página
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    // Handlers de acciones
    const handleEdit = (id: string) => {
        navigate(`/formularios/editar/${id}`);
    };

    const handlePreview = (id: string) => {
        navigate(`/formularios/preview/${id}`);
    };

    const handleDeleteClick = (id: string, titulo: string) => {
        setDeleteModal({ open: true, id, titulo });
    };

    const handleConfirmDelete = async () => {
        setActionLoading(true);
        const success = await deleteFormulario(deleteModal.id);
        setActionLoading(false);
        setDeleteModal({ open: false, id: '', titulo: '' });
        
        if (success) {
            toast.success('Formulario eliminado', `"${deleteModal.titulo}" se ha eliminado correctamente.`);
        } else {
            toast.error('Error al eliminar', 'No se pudo eliminar el formulario. Intenta nuevamente.');
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean, titulo: string) => {
        const newState = !currentState;
        const success = await toggleFormularioActive(id, newState);
        
        if (success) {
            toast.success(
                newState ? 'Formulario activado' : 'Formulario desactivado',
                `"${titulo}" ahora está ${newState ? 'activo y visible' : 'en modo borrador'}.`
            );
        } else {
            toast.error('Error', 'No se pudo cambiar el estado del formulario.');
        }
    };

    const handleRefresh = async () => {
        await refresh();
        toast.info('Lista actualizada', 'Los formularios se han recargado correctamente.');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando formularios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mis Formularios</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {formularios.length} formulario{formularios.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Botón Refrescar */}
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Actualizar lista"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>

                        {/* Barra de búsqueda */}
                        <div className="relative hidden sm:block">
                            <input 
                                type="text" 
                                placeholder="Buscar formulario..." 
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64 focus:outline-none"
                            />
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>

                        <Link
                            to="/formularios/crear"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Crear Nuevo
                        </Link>
                    </div>
                </div>

                {/* Búsqueda móvil */}
                <div className="sm:hidden mb-6">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Buscar formulario..." 
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                {/* --- CONTENIDO --- */}
                {formularios.length === 0 ? (
                    /* Estado vacío inicial */
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay formularios aún</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            Comienza creando tu primer formulario para recolectar información de tus egresados.
                        </p>
                        <Link
                            to="/formularios/crear"
                            className="mt-6 inline-flex items-center text-blue-600 font-medium hover:underline"
                        >
                            Crear mi primer formulario →
                        </Link>
                    </div>
                ) : filteredFormularios.length === 0 ? (
                    /* Sin resultados de búsqueda */
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Sin resultados</h3>
                        <p className="text-gray-500 mt-1">
                            No se encontraron formularios que coincidan con "{searchQuery}"
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-blue-600 font-medium hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : (
                    /* Tabla de formularios con paginación */
                    <>
                        <FormulariosTable
                            formularios={paginatedFormularios}
                            onEdit={handleEdit}
                            onPreview={handlePreview}
                            onDelete={handleDeleteClick}
                            onToggleActive={handleToggleActive}
                        />
                        
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredFormularios.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </>
                )}
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                isOpen={deleteModal.open}
                title="Eliminar formulario"
                message={`¿Estás seguro de que deseas eliminar "${deleteModal.titulo}"? Esta acción no se puede deshacer y se perderán todas las preguntas asociadas.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                loading={actionLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal({ open: false, id: '', titulo: '' })}
            />
        </div>
    );
}