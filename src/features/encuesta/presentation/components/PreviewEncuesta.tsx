import { useState, useEffect } from 'react';
import { FormularioService, type PreguntaDetalle } from '../../../formulario/data/FormularioService';
import type { Encuesta } from '../../domain/Encuesta';
import { 
    DocumentTextIcon, 
    EnvelopeIcon, 
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { tipoPreguntaLabel } from '../../../formulario/domain/tipoPreguntaLabels';

interface PreviewEncuestaProps {
    encuesta: Encuesta;
}

export function PreviewEncuesta({ encuesta }: PreviewEncuestaProps) {
    const [preguntas, setPreguntas] = useState<PreguntaDetalle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPreguntas();
    }, [encuesta]);

    const loadPreguntas = async () => {
        const formularioId = encuesta.relationships?.formulario?.data?.id;
        if (!formularioId) {
            setLoading(false);
            return;
        }

        try {
            const data = await FormularioService.getPreguntas(formularioId);
            // Ordenar por orden_en_formulario
            const ordenadas = data.sort((a, b) => 
                a.attributes.orden_en_formulario - b.attributes.orden_en_formulario
            );
            setPreguntas(ordenadas);
        } catch (error) {
            console.error('Error cargando preguntas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTipoPreguntaNombre = (pregunta: PreguntaDetalle): string => {
        return tipoPreguntaLabel(pregunta.relationships?.tipo_pregunta?.data?.nombre);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Resumen de la Encuesta */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Encuesta</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                        <dd className="mt-1 text-sm text-gray-900">{encuesta.attributes.nombre}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Estado</dt>
                        <dd className="mt-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                encuesta.attributes.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {encuesta.attributes.is_active ? (
                                    <>
                                        <CheckCircleIcon className="w-3.5 h-3.5" />
                                        Activa
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="w-3.5 h-3.5" />
                                        Inactiva
                                    </>
                                )}
                            </span>
                        </dd>
                    </div>
                    {encuesta.attributes.descripcion && (
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                            <dd className="mt-1 text-sm text-gray-900">{encuesta.attributes.descripcion}</dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Preview del Formulario */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Cuestionario</h3>
                    <span className="ml-auto text-sm text-gray-500">{preguntas.length} preguntas</span>
                </div>

                {preguntas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay preguntas en este formulario
                    </div>
                ) : (
                    <div className="space-y-6">
                        {preguntas.map((pregunta, index) => (
                            <div 
                                key={pregunta.id} 
                                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 shrink-0 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {pregunta.attributes.texto_pregunta}
                                                {pregunta.attributes.es_obligatoria === 1 && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </p>
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full shrink-0">
                                                {getTipoPreguntaNombre(pregunta)}
                                            </span>
                                        </div>

                                        {/* Opciones si existen */}
                                        {pregunta.relationships?.opciones && pregunta.relationships.opciones.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {pregunta.relationships.opciones.map((opcion) => (
                                                    <div key={opcion.id} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                                        <span>{opcion.texto}</span>
                                                        {opcion.etiqueta && (
                                                            <span className="text-xs text-gray-400">({opcion.etiqueta})</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview del Template de Correo */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <EnvelopeIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Plantilla de Correo</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Los participantes recibirán un correo con el siguiente formato:
                    </p>
                    <div className="bg-white rounded border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-2">Vista previa simplificada</p>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-sm text-gray-700">
                                Este correo incluirá:
                            </p>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                <li>Nombre personalizado del destinatario</li>
                                <li>Link único de acceso a la encuesta</li>
                                <li>Información de la institución</li>
                                <li>Instrucciones para completar</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
