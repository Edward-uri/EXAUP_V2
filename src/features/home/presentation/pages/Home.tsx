import { 
    ClipboardDocumentListIcon, 
    PaperAirplaneIcon, 
    DocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useHomeStats } from '../hooks/useHomeStats';
import { StatCard, QuickActionCard, RecentSurveysList } from '../components';
import { ROUTES } from '../../../../constants/routes';
import { ConnectionErrorPageAlert } from '../../../../shared/components/PageAlert/ConnectionErrorPageAlert';

export default function HomePage() {
    const { stats, recentSurveys, loading, error, refetch } = useHomeStats();

    const statsConfig = [
        { 
            label: 'Encuestas Activas', 
            value: stats.encuestasActivas, 
            icon: PaperAirplaneIcon, 
            color: 'text-green-600', 
            bg: 'bg-green-50' 
        },
        { 
            label: 'Formularios Creados', 
            value: stats.formulariosCreados, 
            icon: ClipboardDocumentListIcon, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            label: 'Total Respuestas', 
            value: stats.totalRespuestas, 
            icon: DocumentCheckIcon, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50' 
        },
    ];

    if (error === 'CONNECTION_ERROR') {
        return <ConnectionErrorPageAlert onRetry={refetch} />;
    }

    if (error) {
        return (
            <div className="min-h-screen pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800">{error}</p>
                        <button 
                            onClick={refetch}
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-white">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">
                        Panel de Control
                    </h1>
                    <p className="text-sm text-gray-500">
                        Bienvenido. ¿Qué quieres hacer hoy?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <QuickActionCard
                        to={ROUTES.FORMULARIOS_CREAR}
                        icon={ClipboardDocumentListIcon}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-700"
                        title="Diseñar Nuevo Formulario"
                        description="Crea las preguntas y opciones para un nuevo cuestionario."
                        actionText="Comenzar"
                    />
                    
                    <QuickActionCard
                        to={ROUTES.ENCUESTAS_CREAR}
                        icon={PaperAirplaneIcon}
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-700"
                        title="Crear Nueva Encuesta"
                        description="Selecciona un formulario existente, configura la plantilla de correo y guarda."
                        actionText="Iniciar creación"
                        hoverRing="hover:ring-indigo-500/30"
                    />
                </div>

                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Estado del Sistema
                </h3>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {statsConfig.map((item) => (
                            <StatCard
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                icon={item.icon}
                                color={item.color}
                                bg={item.bg}
                            />
                        ))}
                    </div>
                )}

                <RecentSurveysList surveys={recentSurveys} loading={loading} />

            </div>
        </div>
    );
}