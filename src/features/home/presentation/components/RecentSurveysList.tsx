import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import type { Encuesta } from '../../../encuesta/domain/Encuesta';

interface RecentSurveysListProps {
    surveys: Encuesta[];
    loading?: boolean;
}

export function RecentSurveysList({ surveys, loading = false }: RecentSurveysListProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                    Activa
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Inactiva
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (surveys.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Encuestas Recientes</h3>
                    <Link to={ROUTES.ENCUESTAS} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Ver todo
                    </Link>
                </div>
                <div className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">No hay encuestas creadas aún</p>
                    <Link 
                        to={ROUTES.ENCUESTAS_CREAR}
                        className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Crear tu primera encuesta →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Encuestas Recientes</h3>
                <Link to={ROUTES.ENCUESTAS} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver todo
                </Link>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
                {surveys.map((survey) => (
                    <li key={survey.id} className="group">
                        <Link
                            to={`${ROUTES.ENCUESTAS}/${survey.id}/gestionar`}
                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {survey.attributes.nombre}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Creado el {formatDate(survey.attributes.created_at)}
                                </p>
                            </div>
                            {getStatusBadge(survey.attributes.is_active)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
