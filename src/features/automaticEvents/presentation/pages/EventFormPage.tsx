import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventForm } from '../hooks/useEventForm';
import { ROUTES } from '../../../../constants/routes';
import { ArrowLeftIcon, CalendarClockIcon, MailIcon, SaveIcon, TriangleAlertIcon } from 'lucide-react';
import {
    DIAS_SEMANA,
    HORARIO_POR_DEFECTO,
    OPCIONES_FRECUENCIA,
    describir,
    fromCron,
    proximaEjecucion,
    toCron,
    type Horario,
} from '../../domain/schedule';

const HORAS = Array.from({ length: 24 }, (_, i) => i);
const MINUTOS = [0, 15, 30, 45];
const DIAS_MES = Array.from({ length: 28 }, (_, i) => i + 1);
const dd = (n: number) => String(n).padStart(2, '0');

/* `datetime-local` espera hora local; `starts_at` viaja en ISO/UTC. Convertir
   con substring mostraba la hora corrida por el offset de la zona. */
const aInputLocal = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const formatoLargo = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
});

function Campo({ label, children, ayuda }: { label: string; children: React.ReactNode; ayuda?: string }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
            {children}
            {ayuda && <p className="mt-1.5 text-xs text-slate-400">{ayuda}</p>}
        </div>
    );
}

const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20';

export default function EventFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { formData, setFormData, templates, loading, loadingData, handleSubmit } = useEventForm(id);

    const [horario, setHorario] = useState<Horario>(HORARIO_POR_DEFECTO);
    // Sin esto, al cargar un evento el efecto de abajo pisaría su cron con el default.
    const [horarioListo, setHorarioListo] = useState(!id);

    useEffect(() => {
        if (loadingData || horarioListo) return;
        setHorario(fromCron(formData.cron_expression));
        setHorarioListo(true);
    }, [loadingData, horarioListo, formData.cron_expression]);

    useEffect(() => {
        if (!horarioListo) return;
        setFormData(prev => ({
            ...prev,
            cron_expression: toCron(horario),
            timezone: 'America/Mexico_City',
        }));
    }, [horario, horarioListo, setFormData]);

    if (loadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const esPersonalizado = horario.frecuencia === 'personalizado';
    const siguiente = proximaEjecucion(horario, new Date());
    const upd = (parcial: Partial<Horario>) => setHorario(prev => ({ ...prev, ...parcial }));

    const plantillaElegida = templates.find(t => String(t.id) === String(formData.payload.id_template));

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS)}
                        className="rounded-full p-2 transition-colors hover:bg-gray-200"
                    >
                        <ArrowLeftIcon size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-gray-900">
                            {id ? 'Editar envío programado' : 'Nuevo envío programado'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Define qué correo se manda y cada cuándo. No necesitas saber de cron.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl md:p-8">
                        <h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 font-display text-lg font-medium text-slate-800">
                            <CalendarClockIcon size={20} className="text-blue-600" />
                            Cuándo se envía
                        </h2>

                        <div className="space-y-6">
                            <Campo label="Nombre del envío" ayuda="Solo para identificarlo en la lista.">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ej. Felicitaciones de cumpleaños"
                                    className={inputCls}
                                />
                            </Campo>

                            {esPersonalizado ? (
                                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <TriangleAlertIcon size={18} className="mt-0.5 shrink-0 text-amber-600" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-semibold">Este envío usa una programación avanzada</p>
                                        <p className="mt-1">
                                            Su expresión (<code className="rounded bg-amber-100 px-1">{horario.cronCrudo}</code>) no
                                            corresponde a ninguna de las opciones simples, así que se deja intacta.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setHorario({ ...HORARIO_POR_DEFECTO })}
                                            className="mt-2 font-semibold text-amber-900 underline"
                                        >
                                            Reemplazarla por una programación simple
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Campo label="¿Cada cuándo?">
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {OPCIONES_FRECUENCIA.map(op => {
                                                const activa = horario.frecuencia === op.value;
                                                return (
                                                    <button
                                                        key={op.value}
                                                        type="button"
                                                        onClick={() => upd({ frecuencia: op.value })}
                                                        aria-pressed={activa}
                                                        className={`rounded-xl border p-3 text-left transition-all ${
                                                            activa
                                                                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <span className={`block text-sm font-semibold ${activa ? 'text-blue-950' : 'text-slate-700'}`}>
                                                            {op.label}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs text-slate-500">{op.ayuda}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Campo>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {horario.frecuencia === 'semanal' && (
                                            <Campo label="¿Qué día de la semana?">
                                                <select
                                                    value={horario.diaSemana}
                                                    onChange={(e) => upd({ diaSemana: Number(e.target.value) })}
                                                    className={inputCls}
                                                >
                                                    {DIAS_SEMANA.map((d, i) => (
                                                        <option key={d} value={i}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </Campo>
                                        )}

                                        {horario.frecuencia === 'mensual' && (
                                            <Campo label="¿Qué día del mes?" ayuda="Hasta el 28, para que exista también en febrero.">
                                                <select
                                                    value={horario.diaMes}
                                                    onChange={(e) => upd({ diaMes: Number(e.target.value) })}
                                                    className={inputCls}
                                                >
                                                    {DIAS_MES.map(d => <option key={d} value={d}>Día {d}</option>)}
                                                </select>
                                            </Campo>
                                        )}

                                        <Campo label="¿A qué hora?" ayuda="Hora del centro de México.">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={horario.hora}
                                                    onChange={(e) => upd({ hora: Number(e.target.value) })}
                                                    className={inputCls}
                                                >
                                                    {HORAS.map(h => <option key={h} value={h}>{dd(h)}</option>)}
                                                </select>
                                                <span className="text-lg font-bold text-slate-400">:</span>
                                                <select
                                                    value={horario.minuto}
                                                    onChange={(e) => upd({ minuto: Number(e.target.value) })}
                                                    className={inputCls}
                                                >
                                                    {MINUTOS.map(m => <option key={m} value={m}>{dd(m)}</option>)}
                                                </select>
                                            </div>
                                        </Campo>
                                    </div>
                                </>
                            )}

                            {/* Confirmación en lenguaje natural: es la única forma de que
                                alguien verifique que programó lo que quería. */}
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <p className="font-display text-sm font-semibold text-blue-950">{describir(horario)}</p>
                                {siguiente && (
                                    <p className="mt-1 text-sm text-blue-900/70">
                                        Próximo envío: {formatoLargo.format(siguiente)}
                                    </p>
                                )}
                            </div>

                            <Campo
                                label="Empieza a partir de"
                                ayuda="Antes de esta fecha el envío no se ejecuta, aunque esté activo."
                            >
                                <input
                                    type="datetime-local"
                                    required
                                    value={aInputLocal(formData.starts_at)}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        starts_at: new Date(e.target.value).toISOString(),
                                    }))}
                                    className={inputCls}
                                />
                            </Campo>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl md:p-8">
                        <h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 font-display text-lg font-medium text-slate-800">
                            <MailIcon size={20} className="text-blue-600" />
                            Qué se envía
                        </h2>

                        <div className="space-y-6">
                            <Campo
                                label="Plantilla de correo"
                                ayuda={plantillaElegida ? undefined : 'Elige la plantilla que recibirán los egresados.'}
                            >
                                <select
                                    required
                                    value={formData.payload.id_template}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        payload: { ...prev.payload, id_template: Number(e.target.value) },
                                    }))}
                                    className={inputCls}
                                >
                                    <option value={0} disabled>Selecciona una plantilla…</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.attributes.subject || `Plantilla #${t.id}`}
                                        </option>
                                    ))}
                                </select>
                            </Campo>

                            <Campo
                                label="Fecha de referencia (opcional)"
                                ayuda="Simula que el envío corre en otro día — sirve para probar felicitaciones de una fecha concreta. Déjala vacía para usar el día real de cada ejecución."
                            >
                                <input
                                    type="date"
                                    value={formData.payload.reference_date || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        payload: { ...prev.payload, reference_date: e.target.value },
                                    }))}
                                    className={inputCls}
                                />
                            </Campo>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <p className="text-sm text-slate-500">
                            {id ? 'Los cambios aplican desde el próximo envío.' : 'Se creará activo y correrá según lo programado.'}
                        </p>
                        <button
                            type="submit"
                            disabled={loading || !formData.payload.id_template || !formData.name.trim()}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-950 px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-800 hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <><SaveIcon size={20} /> {id ? 'Guardar cambios' : 'Programar envío'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
