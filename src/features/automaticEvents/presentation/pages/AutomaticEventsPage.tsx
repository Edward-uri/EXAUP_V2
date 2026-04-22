import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutomaticEventsList } from '../hooks/useAutomaticEventsList';
import { ROUTES } from '../../../../constants/routes';
import { 
    PlusIcon, 
    PlayIcon, 
    PenSquareIcon, 
    HistoryIcon,
    ClockIcon 
} from 'lucide-react';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';

export default function AutomaticEventsPage() {
    const navigate = useNavigate();
    const { events, loading, toggleStatus, triggerEvent } = useAutomaticEventsList();
    const [triggerTargetId, setTriggerTargetId] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Eventos Automáticos
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Tareas programadas y automatizaciones del sistema
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS_CREAR)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-sm"
                    >
                        <PlusIcon size={18} />
                        Nuevo Evento
                    </button>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Programación (Cron)</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Próxima Ejecución</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No hay eventos automáticos configurados
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{event.name}</span>
                                                <span className="text-xs text-gray-500">{event.event_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                                                <ClockIcon size={14} className="text-gray-400" />
                                                {event.cron_expression}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.next_run_at ? new Date(event.next_run_at).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => toggleStatus(event.id, event.is_active)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
                                                ${event.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
                                            >
                                                <span className="sr-only">Cambiar estado</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out 
                                                    ${event.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setTriggerTargetId(event.id)}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Ejecutar ahora"
                                                >
                                                    <PlayIcon size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS_HISTORIAL(event.id))}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver historial"
                                                >
                                                    <HistoryIcon size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS_EDITAR(event.id))}
                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <PenSquareIcon size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <ConfirmModal
                    isOpen={!!triggerTargetId}
                    title="Ejecución Manual"
                    message="¿Estás seguro de que deseas ejecutar este evento inmediatamente?"
                    confirmText="Ejecutar"
                    onCancel={() => setTriggerTargetId(null)}
                    onConfirm={async () => {
                        if (triggerTargetId) {
                            await triggerEvent(triggerTargetId);
                            setTriggerTargetId(null);
                        }
                    }}
                />
            </div>
        </div>
    );
}
