import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FormularioService, type PreguntaDetalle } from '../../data/FormularioService';
import type { Formulario } from '../../domain/Formulario';
import { 
    ArrowLeftIcon, 
    PencilSquareIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { tipoPreguntaLabel } from '../../domain/tipoPreguntaLabels';


export default function PreviewFormularioPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [formulario, setFormulario] = useState<Formulario | null>(null);
    const [preguntas, setPreguntas] = useState<PreguntaDetalle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [formData, preguntasData] = await Promise.all([
                    FormularioService.getById(id),
                    FormularioService.getPreguntas(id)
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
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando formulario...</p>
                </div>
            </div>
        );
    }

    if (error || !formulario) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <p className="text-red-500 mb-4">{error || 'Formulario no encontrado'}</p>
                <Link to="/formularios" className="text-blue-600 hover:underline">
                    ← Volver a formularios
                </Link>
            </div>
        );
    }

    const isActive = formulario.attributes.is_active;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-20">
            <div className="max-w-3xl mx-auto pt-8 px-4 sm:px-6">
                
                {/* Header con navegación */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate('/formularios')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {isActive ? (
                                <><CheckCircleIcon className="w-3.5 h-3.5" /> Activo</>
                            ) : (
                                <><XCircleIcon className="w-3.5 h-3.5" /> Borrador</>
                            )}
                        </span>
                        <Link
                            to={`/formularios/editar/${id}`}
                            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            Editar
                        </Link>
                    </div>
                </div>

                {/* Card del Formulario */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 border-t-[10px] border-t-blue-600 overflow-hidden">
                    {/* Header del formulario */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            {formulario.attributes.titulo}
                        </h1>
                        {formulario.attributes.descripcion && (
                            <p className="mt-2 text-gray-600">
                                {formulario.attributes.descripcion}
                            </p>
                        )}
                        <p className="mt-4 text-sm text-red-500">* Indica pregunta obligatoria</p>
                    </div>

                    {/* Preguntas */}
                    <div className="divide-y divide-gray-100">
                        {preguntas.length === 0 ? (
                            <div className="px-8 py-12 text-center text-gray-500">
                                Este formulario no tiene preguntas aún.
                            </div>
                        ) : (
                            preguntas
                                .sort((a, b) => a.attributes.orden_en_formulario - b.attributes.orden_en_formulario)
                                .map((pregunta, index) => (
                                    <div key={pregunta.id} className="px-8 py-6">
                                        {/* Texto de la pregunta */}
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-400 text-sm font-medium">{index + 1}.</span>
                                            <div className="flex-1">
                                                <p className="text-base text-gray-900 font-medium">
                                                    {pregunta.attributes.texto_pregunta}
                                                    {pregunta.attributes.es_obligatoria === 1 && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </p>
                                                <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                    {tipoPreguntaLabel(pregunta.relationships.tipo_pregunta.data.nombre)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Renderizado según tipo */}
                                        <div className="mt-4 ml-6">
                                            {renderPreguntaInput(pregunta)}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* Nota de vista previa */}
                <p className="text-center text-sm text-gray-400 mt-8">
                    Esta es una vista previa del formulario. Los campos no son interactivos.
                </p>
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
            <div className="border-b border-dotted border-gray-300 w-full max-w-md py-2 text-sm text-gray-400">
                Tu respuesta
            </div>
        );
    }

    // Boolean (Sí/No)
    if (tipo.includes('boolean')) {
        return (
            <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <span className="text-sm text-gray-600">Sí</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <span className="text-sm text-gray-600">No</span>
                </label>
            </div>
        );
    }

    // Likert
    if (tipo.includes('likert')) {
        return (
            <div className="flex gap-4 flex-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm text-gray-500 hover:border-blue-400 cursor-pointer transition-colors">
                            {n}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Opción múltiple
    if (tipo.includes('múltiple') || tipo.includes('multiple')) {
        return (
            <div className="space-y-3">
                {opciones.length > 0 ? (
                    opciones.map((op, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-600">{op.texto}</span>
                        </label>
                    ))
                ) : (
                    <>
                        <label className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-400">Opción 1</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
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
            <div className="space-y-3">
                {opciones.length > 0 ? (
                    opciones.map((op, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer">
                            <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-600">{op.texto}</span>
                        </label>
                    ))
                ) : (
                    <>
                        <label className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                            <span className="text-sm text-gray-400">Opción 1</span>
                        </label>
                    </>
                )}
            </div>
        );
    }

    // Default
    return (
        <div className="border-b border-dotted border-gray-300 w-full max-w-md py-2 text-sm text-gray-400">
            Tu respuesta
        </div>
    );
}
