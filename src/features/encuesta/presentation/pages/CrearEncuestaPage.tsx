import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrearEncuesta } from '../hooks/useCrearEncuesta';
import { TemplatePreview } from '../components/TemplatePreview';
import { FormularioPreviewModal } from '../components/FormularioPreviewModal';
import { useToast } from '../../../../shared/components/Toast/ToastContext';
import { 
    DocumentTextIcon, 
    EnvelopeIcon, 
    PaperAirplaneIcon,
    ArrowLeftIcon,
    EyeIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

// Componente reutilizable para campos del formulario
const FormField = ({ 
    label, 
    required = false, 
    icon: Icon, 
    error, 
    children 
}: { 
    label: string; 
    required?: boolean; 
    icon?: any; 
    error?: string; 
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
            {Icon && <Icon className="w-4 h-4 inline mr-1.5 text-gray-500" />}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
                <InformationCircleIcon className="w-4 h-4" />
                {error}
            </p>
        )}
    </div>
);

// Componente para el indicador de paso individual
const StepIndicator = ({ 
    stepNumber, 
    title, 
    subtitle, 
    isComplete, 
    isActive 
}: { 
    stepNumber: number; 
    title: string; 
    subtitle: string; 
    isComplete: boolean; 
    isActive: boolean;
}) => (
    <div className="flex items-center gap-3 flex-1">
        <div 
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                isComplete 
                    ? 'bg-green-100 text-green-600 ring-2 ring-green-600 ring-offset-2' 
                    : isActive 
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
            }`}
            aria-label={`Paso ${stepNumber}: ${isComplete ? 'Completado' : isActive ? 'Activo' : 'Pendiente'}`}
        >
            {isComplete ? (
                <CheckCircleIcon className="w-6 h-6" />
            ) : (
                <span className="font-bold">{stepNumber}</span>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${
                isActive ? 'text-gray-900' : 'text-gray-700'
            }`}>
                {title}
            </p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
    </div>
);

// Componente principal
export default function CrearEncuestaPage() {
    const navigate = useNavigate();
    const { formularios, templates, loadingData, saving, createEncuesta } = useCrearEncuesta();
    const toast = useToast();

    // Estados
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [selectedFormId, setSelectedFormId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showFormPreview, setShowFormPreview] = useState(false);
    const [touched, setTouched] = useState({
        nombre: false,
        form: false,
        template: false
    });

    // Validaciones
    const step1Complete = nombre.trim().length >= 3;
    const step2Complete = selectedFormId.length > 0;
    const step3Complete = selectedTemplateId.length > 0;
    const allStepsComplete = step1Complete && step2Complete && step3Complete;

    // Errores de validación
    const errors = {
        nombre: touched.nombre && !step1Complete ? 'El nombre debe tener al menos 3 caracteres' : '',
        form: touched.form && !step2Complete ? 'Debes seleccionar un cuestionario' : '',
        template: touched.template && !step3Complete ? 'Debes seleccionar una plantilla' : ''
    };

    const selectedTemplate = useMemo(() => 
        templates.find(t => t.id === selectedTemplateId), 
        [selectedTemplateId, templates]
    );

    const selectedFormulario = useMemo(() => 
        formularios.find(f => f.id === selectedFormId), 
        [selectedFormId, formularios]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!allStepsComplete) {
            setTouched({ nombre: true, form: true, template: true });
            toast.warning('Formulario incompleto', 'Por favor completa todos los pasos antes de continuar');
            return;
        }
        
        createEncuesta(nombre, descripcion, selectedFormId, selectedTemplateId);
    };

    if (loadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Cargando recursos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                        aria-label="Volver"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 font-display">
                            Crear Nueva Encuesta
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Configura tu encuesta en 3 pasos simples
                        </p>
                    </div>
                </div>

                {/* Indicador de Progreso Mejorado */}
                <div className="mb-8 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
                    <div className="flex items-center justify-between">
                        <StepIndicator
                            stepNumber={1}
                            title="Información General"
                            subtitle="Nombre y descripción"
                            isComplete={step1Complete}
                            isActive={!step1Complete}
                        />
                        
                        <div className={`h-1 w-16 mx-2 rounded-full transition-all duration-300 ${
                            step1Complete ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>

                        <StepIndicator
                            stepNumber={2}
                            title="Cuestionario"
                            subtitle="Selecciona el formulario"
                            isComplete={step2Complete}
                            isActive={step1Complete && !step2Complete}
                        />

                        <div className={`h-1 w-16 mx-2 rounded-full transition-all duration-300 ${
                            step2Complete ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>

                        <StepIndicator
                            stepNumber={3}
                            title="Plantilla de Correo"
                            subtitle="Personaliza el envío"
                            isComplete={step3Complete}
                            isActive={step2Complete && !step3Complete}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <div className="px-4 py-6 sm:p-8 space-y-8">
                            
                            {/* Paso 1: Información General */}
                            <section aria-labelledby="step1-heading">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        1
                                    </span>
                                    <h2 id="step1-heading" className="text-lg font-semibold text-gray-900">
                                        Información General
                                    </h2>
                                    {step1Complete && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-600 ml-auto" aria-label="Completado" />
                                    )}
                                </div>
                                
                                <div className="space-y-4 pl-9">
                                    <FormField 
                                        label="Nombre del Lanzamiento" 
                                        required 
                                        error={errors.nombre}
                                    >
                                        <input
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
                                            className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                                                errors.nombre ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'
                                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all sm:text-sm`}
                                            placeholder="Ej: Encuesta Egresados 2026"
                                            aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                                            aria-invalid={!!errors.nombre}
                                        />
                                    </FormField>

                                    <FormField label="Descripción Interna (opcional)">
                                        <textarea
                                            rows={3}
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all sm:text-sm"
                                            placeholder="Objetivo de esta encuesta..."
                                        />
                                    </FormField>
                                </div>
                            </section>

                            <div className="border-t border-gray-100"></div>

                            {/* Paso 2: Selección de Cuestionario */}
                            <section aria-labelledby="step2-heading" className={!step1Complete ? 'opacity-50' : ''}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        2
                                    </span>
                                    <h2 id="step2-heading" className="text-lg font-semibold text-gray-900">
                                        Seleccionar Cuestionario
                                    </h2>
                                    {step2Complete && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-600 ml-auto" aria-label="Completado" />
                                    )}
                                </div>
                                
                                <div className="space-y-4 pl-9">
                                    <FormField 
                                        label="Cuestionario" 
                                        icon={DocumentTextIcon}
                                        required 
                                        error={errors.form}
                                    >
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedFormId}
                                                onChange={(e) => setSelectedFormId(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, form: true }))}
                                                disabled={!step1Complete}
                                                className={`flex-1 rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                                                    errors.form ? 'ring-red-300' : 'ring-gray-300'
                                                } focus:ring-2 focus:ring-blue-600 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all`}
                                                aria-describedby={errors.form ? 'form-error' : undefined}
                                            >
                                                <option value="">Selecciona un formulario...</option>
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
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                    selectedFormId 
                                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 hover:shadow-sm' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                }`}
                                                title={selectedFormId ? 'Ver vista previa' : 'Selecciona un formulario'}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                <span className="hidden sm:inline">Preview</span>
                                            </button>
                                        </div>
                                    </FormField>

                                    {selectedFormulario && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                                            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-medium text-green-900">
                                                    {selectedFormulario.attributes.titulo}
                                                </p>
                                                <p className="text-green-700 text-xs mt-0.5">
                                                    Cuestionario seleccionado correctamente
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="border-t border-gray-100"></div>

                            {/* Paso 3: Plantilla de Correo */}
                            <section aria-labelledby="step3-heading" className={!step2Complete ? 'opacity-50' : ''}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        3
                                    </span>
                                    <h2 id="step3-heading" className="text-lg font-semibold text-gray-900">
                                        Plantilla de Correo
                                    </h2>
                                    {step3Complete && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-600 ml-auto" aria-label="Completado" />
                                    )}
                                </div>
                                
                                <div className="space-y-4 pl-9">
                                    <FormField 
                                        label="Plantilla" 
                                        icon={EnvelopeIcon}
                                        required 
                                        error={errors.template}
                                    >
                                        <select
                                            value={selectedTemplateId}
                                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                                            onBlur={() => setTouched(prev => ({ ...prev, template: true }))}
                                            disabled={!step2Complete}
                                            className={`block w-full rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                                                errors.template ? 'ring-red-300' : 'ring-gray-300'
                                            } focus:ring-2 focus:ring-blue-600 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all`}
                                        >
                                            <option value="">Selecciona una plantilla...</option>
                                            {templates.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.attributes.subject || "Sin asunto"}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>

                                    {selectedTemplate && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-2">
                                                <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-blue-900">
                                                    <p className="font-medium mb-1">Vista previa disponible →</p>
                                                    <p className="text-blue-700">
                                                        Podrás personalizar el contenido después de crear la encuesta
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Footer con botón de envío */}
                        <div className="flex items-center justify-between gap-4 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50/80 rounded-b-xl">
                            <div className="text-sm text-gray-600">
                                {allStepsComplete ? (
                                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Todo listo para crear
                                    </span>
                                ) : (
                                    <span>Completa los {3 - [step1Complete, step2Complete, step3Complete].filter(Boolean).length} pasos restantes</span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={saving || !allStepsComplete}
                                className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                                    saving || !allStepsComplete 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Crear Encuesta
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Vista Previa de Plantilla */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        {selectedTemplate ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Paso 3
                                    </span>
                                </div>
                                <TemplatePreview 
                                    htmlContent={selectedTemplate.attributes.layout_html 
                                        ? selectedTemplate.attributes.layout_html.replace('{{DYNAMIC_CONTENT}}', selectedTemplate.attributes.body)
                                        : selectedTemplate.attributes.body
                                    }
                                    subject={selectedTemplate.attributes.subject || 'Vista Previa'}
                                />
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-12">
                                <div className="text-center text-gray-400">
                                    <EnvelopeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Vista previa del correo
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Selecciona una plantilla en el paso 3
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Vista Previa */}
            <FormularioPreviewModal
                formularioId={selectedFormId}
                isOpen={showFormPreview}
                onClose={() => setShowFormPreview(false)}
            />
        </div>
    );
}
