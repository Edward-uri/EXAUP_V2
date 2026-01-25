import type { Formulario } from '../../../domain/Formulario';
import { FormularioActions } from './FormularioActions';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface FormularioTableRowProps {
    formulario: Formulario;
    onEdit: (id: string) => void;
    onPreview: (id: string) => void;
    onDelete: (id: string, titulo: string) => void;
    onToggleActive: (id: string, currentState: boolean, titulo: string) => void;
}

export function FormularioTableRow({ 
    formulario, 
    onEdit, 
    onPreview, 
    onDelete, 
    onToggleActive 
}: FormularioTableRowProps) {
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha';
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isActive = formulario.attributes.is_active;

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            {/* Columna: Formulario (Título + Descripción) */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <DocumentTextIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[300px]" title={formulario.attributes.titulo}>
                            {formulario.attributes.titulo}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-[300px]" title={formulario.attributes.descripcion}>
                            {formulario.attributes.descripcion || 'Sin descripción'}
                        </p>
                    </div>
                </div>
            </td>

            {/* Columna: Estado */}
            <td className="px-6 py-4 hidden md:table-cell">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                }`}>
                    {isActive ? (
                        <><CheckCircleIcon className="w-3.5 h-3.5" /> Activo</>
                    ) : (
                        <><XCircleIcon className="w-3.5 h-3.5" /> Borrador</>
                    )}
                </span>
            </td>

            {/* Columna: Fecha */}
            <td className="px-6 py-4 hidden lg:table-cell">
                <span className="text-sm text-gray-500">
                    {formatDate(formulario.attributes.fecha_creacion)}
                </span>
            </td>

            {/* Columna: Acciones */}
            <td className="px-6 py-4 text-right">
                <FormularioActions
                    formularioId={formulario.id}
                    titulo={formulario.attributes.titulo}
                    isActive={isActive}
                    onEdit={() => onEdit(formulario.id)}
                    onPreview={() => onPreview(formulario.id)}
                    onDelete={() => onDelete(formulario.id, formulario.attributes.titulo)}
                    onToggleActive={() => onToggleActive(formulario.id, isActive, formulario.attributes.titulo)}
                />
            </td>
        </tr>
    );
}
