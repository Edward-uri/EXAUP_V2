import { Link } from 'react-router-dom';
import { 
    ClipboardDocumentListIcon, 
    PaperAirplaneIcon, 
    DocumentCheckIcon,
    UsersIcon,
    ArrowRightIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
    // Estos datos vendrían de tu API en el futuro. 
    // Por ahora son estáticos para la estructura.
    const stats = [
        { label: 'Encuestas Activas', value: '3', icon: PaperAirplaneIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Formularios Creados', value: '12', icon: ClipboardDocumentListIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Respuestas', value: '845', icon: DocumentCheckIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const recentSurveys = [
        { id: 1, name: 'Seguimiento Egresados 2026', status: 'En curso', date: '25 Ene 2026' },
        { id: 2, name: 'Satisfacción Docente Q1', status: 'Borrador', date: '24 Ene 2026' },
        { id: 3, name: 'Clima Laboral', status: 'Finalizada', date: '20 Ene 2026' },
    ];

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-5xl mx-auto">
                
                {/* --- HEADER SIMPLE --- */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">
                        Panel de Control
                    </h1>
                    <p className="text-sm text-gray-500">
                        Bienvenido. ¿Qué quieres hacer hoy?
                    </p>
                </div>

                {/* --- SECCIÓN 1: ACCIONES RÁPIDAS (Lo más importante) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    
                    {/* Card: Crear Formulario */}
                    <Link 
                        to="/formularios/crear"
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:ring-blue-500/30"
                    >
                        <div>
                            <span className="inline-flex rounded-lg bg-blue-50 p-3 text-blue-700 ring-4 ring-white">
                                <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                Diseñar Nuevo Formulario
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Crea las preguntas y opciones para un nuevo cuestionario.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                            Comenzar <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>

                    {/* Card: Lanzar Encuesta */}
                    <Link 
                        to="/encuestas/crear"
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:ring-indigo-500/30"
                    >
                        <div>
                            <span className="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-700 ring-4 ring-white">
                                <PaperAirplaneIcon className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                Lanzar Nueva Encuesta
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Selecciona un formulario existente, configura la plantilla de correo y envíalo.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                            Iniciar lanzamiento <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                </div>

                {/* --- SECCIÓN 2: RESUMEN RÁPIDO (Números) --- */}
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Estado del Sistema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((item) => (
                        <div key={item.label} className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div className={`p-3 rounded-full ${item.bg}`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- SECCIÓN 3: LO ÚLTIMO (Listado simple) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Encuestas Recientes</h3>
                        <Link to="/encuestas/enviadas" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Ver todo
                        </Link>
                    </div>
                    <ul role="list" className="divide-y divide-gray-100">
                        {recentSurveys.map((survey) => (
                            <li key={survey.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{survey.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Creado el {survey.date}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                    ${survey.status === 'En curso' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 
                                      survey.status === 'Borrador' ? 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10' : 
                                      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10'}`}>
                                    {survey.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}