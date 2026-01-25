import type { Formulario } from '../../../domain/Formulario';
import { FormularioTableRow } from './FormularioTableRow';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface FormulariosTableProps {
    formularios: Formulario[];
    onEdit: (id: string) => void;
    onPreview: (id: string) => void;
    onDelete: (id: string, titulo: string) => void;
    onToggleActive: (id: string, currentState: boolean, titulo: string) => void;
}

export function FormulariosTable({ 
    formularios, 
    onEdit, 
    onPreview, 
    onDelete, 
    onToggleActive 
}: FormulariosTableProps) {
    
    if (formularios.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Sin resultados</h3>
                <p className="text-gray-500 mt-1">No se encontraron formularios</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Formulario
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                                Fecha de creación
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {formularios.map((formulario) => (
                            <FormularioTableRow
                                key={formulario.id}
                                formulario={formulario}
                                onEdit={onEdit}
                                onPreview={onPreview}
                                onDelete={onDelete}
                                onToggleActive={onToggleActive}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
