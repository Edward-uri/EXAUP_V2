import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../../../../../constants/routes';
import type { Encuesta } from '../../../domain/Encuesta';

interface PageHeaderProps {
    encuesta: Encuesta;
}

export function PageHeader({ encuesta }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={() => navigate(ROUTES.ENCUESTAS)} 
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-500"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 font-display">
                    {encuesta.attributes.nombre}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {encuesta.attributes.descripcion || 'Gestionar asignaciones y envíos'}
                </p>
            </div>
            <button
                onClick={() => navigate(ROUTES.ENCUESTAS_ANALYTICS(encuesta.id))}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
                <ChartBarIcon className="w-5 h-5" />
                Ver Métricas
            </button>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                encuesta.attributes.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
            }`}>
                {encuesta.attributes.is_active ? 'Activa' : 'Inactiva'}
            </div>
        </div>
    );
}
