import { useState, useMemo } from 'react';
import { useCrearEncuesta } from '../hooks/useCrearEncuesta';
import { TemplatePreview } from '../components/TemplatePreview';
import { FormularioPreviewModal } from '../components/FormularioPreviewModal';
import { 
    DocumentTextIcon, 
    EnvelopeIcon, 
    PaperAirplaneIcon,
    ArrowLeftIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function CrearEncuestaPage() {
    const navigate = useNavigate();
    const { formularios, templates, loadingData, saving, createEncuesta } = useCrearEncuesta();

    // Estados
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [selectedFormId, setSelectedFormId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showFormPreview, setShowFormPreview] = useState(false);

    // Lógica para obtener el HTML de la plantilla seleccionada
    const selectedTemplate = useMemo(() => {
        return templates.find(t => t.id === selectedTemplateId);
    }, [selectedTemplateId, templates]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFormId || !selectedTemplateId) {
            alert("Completa todos los campos requeridos.");
            return;
        }
        createEncuesta(nombre, descripcion, selectedFormId, selectedTemplateId);
    };

    if (loadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                     <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Lanzar Nueva Encuesta
                        </h1>
                        <p className="text-sm text-gray-500">
                            Configura los detalles y selecciona la plantilla de comunicación.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <div className="px-4 py-6 sm:p-8 space-y-8">
                            
                            {/* Bloque 1: Datos Básicos */}
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">1</span>
                                    Información General
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nombre del Lanzamiento</label>
                                        <input
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm pl-3"
                                            placeholder="Ej: Encuesta Egresados 2026"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción Interna</label>
                                        <textarea
                                            rows={3}
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm pl-3"
                                            placeholder="Objetivo de esta encuesta..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Bloque 2: Configuración */}
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">2</span>
                                    Configuración de Envío
                                </h3>
                                <div className="mt-4 space-y-6">
                                    
                                    {/* Select Formulario */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            <DocumentTextIcon className="w-4 h-4 inline mr-1 text-gray-500" />
                                            Cuestionario
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedFormId}
                                                onChange={(e) => setSelectedFormId(e.target.value)}
                                                className="flex-1 block rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm cursor-pointer"
                                                required
                                            >
                                                <option value="" disabled>Selecciona un formulario...</option>
                                                {formularios.map((f) => (
                                                    <option key={f.id} value={f.id}>
                                                        {f.attributes.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowFormPreview(true)}
                                                disabled={!selectedFormId}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                    ${selectedFormId 
                                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                    }
                                                `}
                                                title={selectedFormId ? 'Ver vista previa del formulario' : 'Selecciona un formulario primero'}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                <span className="hidden sm:inline">Vista previa</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Select Template */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            <EnvelopeIcon className="w-4 h-4 inline mr-1 text-gray-500" />
                                            Plantilla de Correo
                                        </label>
                                        <select
                                            value={selectedTemplateId}
                                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled>Selecciona una plantilla...</option>
                                            {templates.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.attributes.subject || "Sin asunto"}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Se usará esta plantilla para enviar los correos masivos. Verifica la vista previa a la derecha.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50/50 rounded-b-xl">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all flex items-center gap-2 w-full sm:w-auto justify-center
                                    ${saving ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5'}
                                `}
                            >
                                {saving ? 'Creando...' : (
                                    <>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Crear y Programar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* COLUMNA DERECHA: Preview Sticky */}
                    <div className="lg:sticky lg:top-8 h-[600px]">
                        <TemplatePreview 
                            htmlContent={selectedTemplate?.attributes.body || ''} 
                            subject={selectedTemplate?.attributes.subject || 'Sin plantilla seleccionada'}
                        />
                    </div>

                </div>
            </div>

            {/* Modal de Vista Previa del Formulario */}
            <FormularioPreviewModal
                formularioId={selectedFormId}
                isOpen={showFormPreview}
                onClose={() => setShowFormPreview(false)}
            />
        </div>
    );
}