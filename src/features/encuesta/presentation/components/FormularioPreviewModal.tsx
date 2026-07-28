import { useEffect, useState } from 'react';
import { FormularioService, type PreguntaDetalle } from '../../../formulario/data/FormularioService';
import type { Formulario } from '../../../formulario/domain/Formulario';
import { 
    XMarkIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { tipoPreguntaLabel } from '../../../formulario/domain/tipoPreguntaLabels';


interface FormularioPreviewModalProps {
    formularioId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function FormularioPreviewModal({ formularioId, isOpen, onClose }: FormularioPreviewModalProps) {
    const [formulario, setFormulario] = useState<Formulario | null>(null);
    const [preguntas, setPreguntas] = useState<PreguntaDetalle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!formularioId || !isOpen) return;
            
            setLoading(true);
            setError(null);
            try {
                const [formData, preguntasData] = await Promise.all([
                    FormularioService.getById(formularioId),
                    FormularioService.getPreguntas(formularioId)
                ]);
                setFormulario(formData);
                setPreguntas(preguntasData);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el formulario.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [formularioId, isOpen]);

    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Vista previa del formulario</h2>
                            <p className="text-sm text-gray-500">Así verán los egresados este cuestionario</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-sm text-gray-500">Cargando formulario...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : formulario ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {formulario.attributes.titulo}
                                        </h3>
                                        {formulario.attributes.descripcion && (
                                            <p className="mt-1 text-blue-100 text-sm">
                                                {formulario.attributes.descripcion}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                        formulario.attributes.is_active 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-white/20 text-white'
                                    }`}>
                                        {formulario.attributes.is_active ? (
                                            <><CheckCircleIcon className="w-3.5 h-3.5" /> Activo</>
                                        ) : (
                                            <><XCircleIcon className="w-3.5 h-3.5" /> Borrador</>
                                        )}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs text-blue-200">
                                    {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''} • <span className="text-red-300">*</span> Indica campo obligatorio
                                </p>
                            </div>

                            {/* Questions */}
                            <div className="divide-y divide-gray-100">
                                {preguntas.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-gray-500">
                                        Este formulario no tiene preguntas aún.
                                    </div>
                                ) : (
                                    preguntas
                                        .sort((a, b) => a.attributes.orden_en_formulario - b.attributes.orden_en_formulario)
                                        .map((pregunta, index) => (
                                            <div key={pregunta.id} className="px-6 py-5">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {pregunta.attributes.texto_pregunta}
                                                            {pregunta.attributes.es_obligatoria === 1 && (
                                                                <span className="text-red-500 ml-1">*</span>
                                                            )}
                                                        </p>
                                                        <span className="inline-block mt-1.5 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                                            {tipoPreguntaLabel(pregunta.relationships.tipo_pregunta.data.nombre)}
                                                        </span>
                                                        
                                                        {/* Preview del input */}
                                                        <div className="mt-3">
                                                            {renderPreguntaInput(pregunta)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper para renderizar el input según el tipo de pregunta
function renderPreguntaInput(pregunta: PreguntaDetalle) {
    const tipo = pregunta.relationships.tipo_pregunta.data.nombre.toLowerCase();
    const opciones = pregunta.relationships.opciones || [];

    // Texto abierto
    if (tipo.includes('abierta') || tipo.includes('texto')) {
        return (
            <div className="border-b border-dotted border-gray-300 w-full max-w-sm py-2 text-sm text-gray-400">
                Tu respuesta
            </div>
        );
    }

    // Boolean (Sí/No)
    if (tipo.includes('boolean')) {
        return (
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <span className="text-sm text-gray-600">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <span className="text-sm text-gray-600">No</span>
                </label>
            </div>
        );
    }

    // Likert
    if (tipo.includes('likert')) {
        return (
            <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                        {n}
                    </div>
                ))}
            </div>
        );
    }

    // Opción múltiple
    if (tipo.includes('múltiple') || tipo.includes('multiple')) {
        return (
            <div className="space-y-2">
                {opciones.length > 0 ? (
                    opciones.map((op, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-600">{op.texto}</span>
                        </label>
                    ))
                ) : (
                    <>
                        <label className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-400">Opción 1</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-400">Opción 2</span>
                        </label>
                    </>
                )}
            </div>
        );
    }

    // Casillas (checkbox)
    if (tipo.includes('casilla') || tipo.includes('check')) {
        return (
            <div className="space-y-2">
                {opciones.length > 0 ? (
                    opciones.map((op, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                            <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-600">{op.texto}</span>
                        </label>
                    ))
                ) : (
                    <label className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
                        <span className="text-sm text-gray-400">Opción 1</span>
                    </label>
                )}
            </div>
        );
    }

    // Default
    return (
        <div className="border-b border-dotted border-gray-300 w-full max-w-sm py-2 text-sm text-gray-400">
            Tu respuesta
        </div>
    );
}
