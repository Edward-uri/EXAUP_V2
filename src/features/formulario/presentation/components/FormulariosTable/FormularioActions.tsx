import { useState } from 'react';
import { 
    EyeIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    EllipsisHorizontalIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface FormularioActionsProps {
    formularioId: string;
    titulo: string;
    isActive: boolean;
    onEdit: () => void;
    onPreview: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
}

export function FormularioActions({ 
    isActive, 
    onEdit, 
    onPreview, 
    onDelete, 
    onToggleActive 
}: FormularioActionsProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex items-center justify-end gap-1">
            {/* Botones visibles en desktop */}
            <div className="hidden sm:flex items-center gap-1">
                <button
                    onClick={onPreview}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Vista previa"
                >
                    <EyeIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onToggleActive}
                    className={`p-2 rounded-lg transition-colors ${
                        isActive 
                            ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={isActive ? 'Desactivar' : 'Activar'}
                >
                    {isActive ? (
                        <XCircleIcon className="w-5 h-5" />
                    ) : (
                        <CheckCircleIcon className="w-5 h-5" />
                    )}
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Menú desplegable para móvil */}
            <div className="sm:hidden relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>

                {menuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button 
                                onClick={() => { onPreview(); setMenuOpen(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                            >
                                <EyeIcon className="w-4 h-4" /> Vista previa
                            </button>
                            <button 
                                onClick={() => { onEdit(); setMenuOpen(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                            >
                                <PencilSquareIcon className="w-4 h-4" /> Editar
                            </button>
                            <button 
                                onClick={() => { onToggleActive(); setMenuOpen(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                            >
                                {isActive ? (
                                    <><XCircleIcon className="w-4 h-4" /> Desactivar</>
                                ) : (
                                    <><CheckCircleIcon className="w-4 h-4" /> Activar</>
                                )}
                            </button>
                            <hr className="my-1 border-gray-100" />
                            <button 
                                onClick={() => { onDelete(); setMenuOpen(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                                <TrashIcon className="w-4 h-4" /> Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
