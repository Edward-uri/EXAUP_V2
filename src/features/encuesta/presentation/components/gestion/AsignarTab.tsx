import { UserGroupIcon } from '@heroicons/react/24/outline';

interface AsignarTabProps {
    onAsignarClick: () => void;
}

export function AsignarTab({ onAsignarClick }: AsignarTabProps) {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
            <div className="text-center max-w-md mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Asignar Grupos de Egresados
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Asigna grupos de egresados que podrán contestar esta encuesta.
                    Los miembros del grupo recibirán acceso automáticamente.
                </p>
                <button
                    onClick={onAsignarClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                    <UserGroupIcon className="w-5 h-5" />
                    Asignar Grupo
                </button>
            </div>
        </div>
    );
}
