import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useMisEncuestas } from '../hooks/useMisEncuestas';
import type { MiEncuesta } from '../../domain/MiEncuesta';
import { ROUTES } from '../../../../constants/routes';

type Tab = 'pendientes' | 'historial';

function formatFecha(valor?: string): string {
    if (!valor) return 'Sin fecha';
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return valor;
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function MisEncuestasPage() {
    const navigate = useNavigate();
    const { pendientes, respondidas, loading, error, refetch } = useMisEncuestas();
    const [tab, setTab] = useState<Tab>('pendientes');

    const lista = tab === 'pendientes' ? pendientes : respondidas;

    const responder = (encuesta: MiEncuesta) => {
        if (!encuesta.uuid) return;
        navigate(ROUTES.ENCUESTAS_RESPONDER_SHORT(encuesta.uuid));
    };

    return (
        <div className="min-h-screen pb-20 bg-slate-50">
            <div className="max-w-5xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Mis Encuestas</h1>
                    <p className="text-sm text-gray-500">
                        Responde las que tienes pendientes y consulta el historial de las que ya contestaste.
                    </p>
                </div>

                {/* Pestañas */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setTab('pendientes')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            tab === 'pendientes'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <ClockIcon className="w-4 h-4" />
                        Pendientes ({pendientes.length})
                    </button>
                    <button
                        onClick={() => setTab('historial')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            tab === 'historial'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <CheckCircleIcon className="w-4 h-4" />
                        Historial ({respondidas.length})
                    </button>
                </div>

                {/* Estado: cargando */}
                {loading && (
                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Estado: error */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{error}</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <ArrowPathIcon className="w-4 h-4" /> Intentar de nuevo
                        </button>
                    </div>
                )}

                {/* Estado: vacío */}
                {!loading && !error && lista.length === 0 && (
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center">
                        <ClipboardDocumentListIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">
                            {tab === 'pendientes'
                                ? 'No tienes encuestas pendientes por responder.'
                                : 'Aún no has respondido ninguna encuesta.'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Las encuestas te llegan por correo con un enlace único de acceso.
                        </p>
                    </div>
                )}

                {/* Lista */}
                {!loading && !error && lista.length > 0 && (
                    <div className="grid gap-4">
                        {lista.map((e) => (
                            <div key={e.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{e.nombre}</p>
                                    {e.descripcion && (
                                        <p className="text-sm text-gray-500 mt-0.5">{e.descripcion}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        {tab === 'pendientes'
                                            ? `Enviada: ${formatFecha(e.fechaEnvio)}`
                                            : `Respondida el ${formatFecha(e.fechaRespuesta)}`}
                                    </p>
                                </div>

                                {tab === 'pendientes' ? (
                                    <button
                                        onClick={() => responder(e)}
                                        disabled={!e.uuid}
                                        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Responder <PaperAirplaneIcon className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                        <CheckCircleIcon className="w-4 h-4" /> Respondida
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
