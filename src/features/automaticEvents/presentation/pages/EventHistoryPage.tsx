import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventHistory } from '../hooks/useEventHistory';
import { ROUTES } from '../../../../constants/routes';
import { 
    ArrowLeftIcon, 
    CalendarIcon, 
    CheckCircle2Icon, 
    XCircleIcon,
    ClockIcon,
    ActivityIcon
} from 'lucide-react';

export default function EventHistoryPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { event, runs, loading } = useEventHistory(id);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">No se encontró la información del evento</p>
                    <button
                        onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS)}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Historial de Ejecuciones
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {event.name} • {event.event_type}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-900/5">
                        <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <ClockIcon size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Próxima Ejecución</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                            {event.next_run_at ? new Date(event.next_run_at).toLocaleString() : 'No programada'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-900/5">
                        <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <ActivityIcon size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Total de Ejecuciones</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{runs.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-900/5">
                        <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <CalendarIcon size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Expresión Cron</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 font-mono">{event.cron_expression}</p>
                    </div>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-white">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Registro Detallado</h2>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mensaje / Resultado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {runs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                        No hay registros de ejecución para este evento
                                    </td>
                                </tr>
                            ) : (
                                runs.map((run) => (
                                    <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            #{run.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                            {new Date(run.executed_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                                ${run.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                                                  run.status === 'failed' ? 'bg-red-50 text-red-700' : 
                                                  'bg-blue-50 text-blue-700'}`}>
                                                {run.status === 'success' ? <CheckCircle2Icon size={14} /> : 
                                                 run.status === 'failed' ? <XCircleIcon size={14} /> : 
                                                 <ClockIcon size={14} />}
                                                {run.status === 'success' ? 'EXITOSO' : run.status === 'failed' ? 'FALLIDO' : 'PENDIENTE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                                            {run.message || 'Sin mensaje adicional'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
