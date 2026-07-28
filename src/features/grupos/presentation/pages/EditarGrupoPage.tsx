import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditarGrupo } from '../hooks/useEditarGrupo';
import { ROUTES } from '../../../../constants/routes';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditarGrupoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { grupo, miembros, loading, updating, updateGrupo, removeMember } = useEditarGrupo(id);

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        if (grupo) {
            setNombre(grupo.attributes.nombre || grupo.attributes.name || '');
            setDescripcion(grupo.attributes.descripcion || '');
        }
    }, [grupo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateGrupo(nombre, descripcion);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!grupo) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-gray-500">Grupo no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(ROUTES.GRUPOS)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Editar Grupo
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Modifica la información básica o elimina miembros
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                required
                                rows={3}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={updating || (!nombre.trim() || !descripcion.trim())}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-800 disabled:bg-gray-400"
                            >
                                {updating ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Miembros del Grupo ({miembros.length})
                        </h3>
                    </div>
                    <ul role="list" className="divide-y divide-gray-200">
                        {miembros.length === 0 ? (
                            <li className="px-4 py-8 text-center text-sm text-gray-500">
                                No hay miembros en este grupo
                            </li>
                        ) : (
                            miembros.map((miembro) => (
                                <li key={miembro.id} className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {miembro.attributes.egresado?.nombre?.charAt(0) || 'E'}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {miembro.attributes.egresado?.nombre} {miembro.attributes.egresado?.primer_apellido} {miembro.attributes.egresado?.segundo_apellido}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {miembro.attributes.egresado?.matricula} • {miembro.attributes.egresado?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setDeleteTargetId(miembro.attributes.id_egresado.toString())}
                                            className="text-red-600 hover:text-red-900 p-2"
                                            title="Eliminar miembro"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <ConfirmModal
                    isOpen={!!deleteTargetId}
                    title="Eliminar Miembro"
                    message="¿Estás seguro de eliminar a este egresado del grupo?"
                    variant="danger"
                    loading={removing}
                    onCancel={() => {
                        if (removing) return;
                        setDeleteTargetId(null);
                    }}
                    onConfirm={async () => {
                        if (!deleteTargetId) return;
                        try {
                            setRemoving(true);
                            await removeMember(deleteTargetId);
                            setDeleteTargetId(null);
                        } finally {
                            setRemoving(false);
                        }
                    }}
                />
            </div>
        </div>
    );
}