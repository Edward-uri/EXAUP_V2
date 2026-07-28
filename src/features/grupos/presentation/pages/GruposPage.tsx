import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGruposList } from '../hooks/useGruposList';
import { ROUTES } from '../../../../constants/routes';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { PlusIcon, TrashIcon, PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ConnectionErrorPageAlert } from '../../../../shared/components/PageAlert/ConnectionErrorPageAlert';

export default function GruposPage() {
    const navigate = useNavigate();
    const { grupos, loading, error, deleteGrupo, refetch } = useGruposList();
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

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
                            Grupos de Egresados
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestiona los grupos para asignar a encuestas
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.GRUPOS_CREAR)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold text-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Crear Grupo
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Descripción</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {grupos.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>No hay grupos creados aún</p>
                                    </td>
                                </tr>
                            ) : (
                                grupos.map((grupo) => (
                                    <tr key={grupo.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {grupo.attributes.nombre || grupo.attributes.name || 'Sin nombre'}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            {grupo.attributes.descripcion}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button
                                                onClick={() => navigate(ROUTES.GRUPOS_EDITAR(grupo.id))}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <PencilSquareIcon className="h-5 w-5 inline" />
                                                <span className="sr-only">Editar</span>
                                            </button>
                                            <button
                                                onClick={() => setDeleteTargetId(grupo.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5 inline" />
                                                <span className="sr-only">Eliminar</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <ConfirmModal
                    isOpen={!!deleteTargetId}
                    title="Eliminar Grupo"
                    message="¿Estás seguro de eliminar este grupo? Esta acción no se puede deshacer."
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
                            await deleteGrupo(deleteTargetId);
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