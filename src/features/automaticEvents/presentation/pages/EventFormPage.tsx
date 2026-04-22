import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventForm } from '../hooks/useEventForm';
import { ROUTES } from '../../../../constants/routes';
import { ArrowLeftIcon, SaveIcon, ClockIcon } from 'lucide-react';

// Helpers para CRON
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const FREQUENCIES = [
    { label: 'Diario', value: 'daily' },
    { label: 'Lunes a Viernes', value: 'weekdays' },
];

export default function EventFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        formData, 
        setFormData, 
        templates, 
        loading, 
        loadingData, 
        handleSubmit 
    } = useEventForm(id);

    // Estado local para la interfaz simplificada
    const [uiFrequency, setUiFrequency] = useState('daily');
    const [uiHour, setUiHour] = useState(9);

    useEffect(() => {
        if (!loadingData && formData.cron_expression) {
            const parts = formData.cron_expression.split(' ');
            if (parts.length >= 5) {
                setUiHour(Number(parts[1]));
                if (parts[4] === '1-5') {
                    setUiFrequency('weekdays');
                } else {
                    setUiFrequency('daily');
                }
            }
        }
    }, [loadingData, formData.cron_expression]);

    useEffect(() => {
        // Actualizar el cron real en el formData cuando cambia la UI
        let cron = `0 ${uiHour} * * *`; // Default daily
        if (uiFrequency === 'weekdays') {
            cron = `0 ${uiHour} * * 1-5`;
        }
        
        setFormData(prev => ({
            ...prev,
            cron_expression: cron,
            timezone: 'America/Mexico_City' // Siempre fijo
        }));
    }, [uiFrequency, uiHour]);

    if (loadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('payload.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                payload: {
                    ...prev.payload,
                    [field]: field === 'id_template' ? Number(value) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(ROUTES.EVENTOS_AUTOMATICOS)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            {id ? 'Editar Evento Programado' : 'Nuevo Evento Programado'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configura cuándo y qué información se enviará automáticamente
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección 1: Qué y Cuándo */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl p-6 md:p-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <ClockIcon size={20} className="text-blue-600" />
                            Programación del Envío
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre descriptivo del evento</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. Felicitaciones de Cumpleaños Diarias"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">¿Con qué frecuencia?</label>
                                <select
                                    value={uiFrequency}
                                    onChange={(e) => setUiFrequency(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                >
                                    {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">¿A qué hora del día?</label>
                                <select
                                    value={uiHour}
                                    onChange={(e) => setUiHour(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold"
                                >
                                    {HOURS.map(h => (
                                        <option key={h} value={h}>
                                            {h < 10 ? `0${h}` : h}:00 {h >= 12 ? 'PM' : 'AM'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha de inicio del servicio</label>
                                <input
                                    type="datetime-local"
                                    name="starts_at"
                                    required
                                    value={formData.starts_at.substring(0, 16)}
                                    onChange={(e) => setFormData(prev => ({ ...prev, starts_at: new Date(e.target.value).toISOString() }))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Contenido */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-2xl p-6 md:p-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Configuración del Mensaje</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plantilla de Correo a utilizar</label>
                                <select
                                    name="payload.id_template"
                                    required
                                    value={formData.payload.id_template}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                                >
                                    <option value={0} disabled>Selecciona una plantilla de la lista...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.attributes.subject || `Plantilla #${t.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha de Referencia (Opcional)</label>
                                <input
                                    type="date"
                                    name="payload.reference_date"
                                    value={formData.payload.reference_date || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                                <p className="mt-2 text-[10px] text-slate-400 italic">Dejar vacío para usar la fecha actual del sistema.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading || formData.payload.id_template === 0 || !formData.name.trim()}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <><SaveIcon size={20} /> {id ? 'Guardar Cambios' : 'Confirmar y Activar'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
