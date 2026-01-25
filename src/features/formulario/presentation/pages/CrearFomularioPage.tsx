import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormularioBuilder } from '../hooks/useFormulario';
import { FormHeader } from '../components/FormHeader';
import { QuestionCard } from '../components/QuestionCard';
import { FloatingToolbox } from '../components/FloatingToolbox';
import { useToast } from '../../../../shared/components/Toast';
import type { Pregunta } from '../../domain/Pregunta';

export default function CrearFormularioPage() {
    const { id: formularioId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!formularioId;
    
    // Hook para lógica de negocio
    const { 
        tiposPregunta, 
        saveFormularioCompleto, 
        updateFormulario,
        saving,
        loading,
        formularioData 
    } = useFormularioBuilder(formularioId);
    
    const toast = useToast();

    // Estado del Formulario
    const [titulo, setTitulo] = useState('Formulario sin título');
    const [descripcion, setDescripcion] = useState('');
    
    // Estado de las Preguntas
    const [preguntas, setPreguntas] = useState<Pregunta[]>([
        { id: '1', texto: '', tipoId: '', es_requerida: false, opciones: [] }
    ]);
    
    // Cuál pregunta está activa
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>('1');

    // Cargar datos cuando estamos en modo edición
    useEffect(() => {
        if (formularioData) {
            setTitulo(formularioData.titulo);
            setDescripcion(formularioData.descripcion);
            setPreguntas(formularioData.preguntas);
            if (formularioData.preguntas.length > 0) {
                setActiveQuestionId(formularioData.preguntas[0].id);
            }
        }
    }, [formularioData]);

    // --- MANEJADORES ---
    
    const addQuestion = () => {
        const newId = `new-${Date.now()}`; 
        const defaultTipo = tiposPregunta.length > 0 ? tiposPregunta[0].id : ''; 
        
        const newQuestion: Pregunta = {
            id: newId,
            texto: '',
            tipoId: defaultTipo,
            es_requerida: false,
            opciones: [{ texto: 'Opción 1' }]
        };
        setPreguntas([...preguntas, newQuestion]);
        setActiveQuestionId(newId); 
        
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const updateQuestion = (id: string, field: keyof Pregunta, value: any) => {
        setPreguntas(prev => prev.map(p => 
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const deleteQuestion = (id: string) => {
        if (preguntas.length === 1) {
            toast.warning(
                'Acción no permitida',
                'El formulario debe tener al menos una pregunta. No puedes eliminar la única pregunta.'
            );
            return;
        }
        setPreguntas(prev => prev.filter(p => p.id !== id));
        toast.info('Pregunta eliminada', 'La pregunta se ha eliminado del formulario.');
    };

    // --- GUARDADO ---
    const handleSave = async () => {
        // Validación: Título obligatorio
        if (!titulo.trim() || titulo === 'Formulario sin título') {
            toast.error(
                'Título requerido',
                'Por favor, ingresa un título descriptivo para el formulario. No puede estar vacío ni ser el título por defecto.'
            );
            return;
        }

        // Validación: Al menos una pregunta
        if (preguntas.length === 0) {
            toast.error(
                'Sin preguntas',
                'El formulario debe tener al menos una pregunta. Añade preguntas antes de guardar.'
            );
            return;
        }
        
        // Validación: Todas las preguntas deben tener tipo
        if (preguntas.some(p => !p.tipoId)) {
            toast.error(
                'Tipo de pregunta faltante',
                'Todas las preguntas deben tener un tipo seleccionado. Revisa las preguntas marcadas.'
            );
            return;
        }

        // Validación: Todas las preguntas deben tener texto
        const preguntasSinTexto = preguntas.filter(p => !p.texto.trim());
        if (preguntasSinTexto.length > 0) {
            toast.error(
                'Preguntas incompletas',
                `${preguntasSinTexto.length} pregunta${preguntasSinTexto.length > 1 ? 's no tienen' : ' no tiene'} texto. Completa todas las preguntas antes de guardar.`
            );
            return;
        }

        try {
            if (isEditMode && formularioId) {
                await updateFormulario(formularioId, titulo, descripcion, preguntas);
                toast.success(
                    'Formulario actualizado',
                    `"${titulo}" se ha actualizado correctamente.`
                );
            } else {
                await saveFormularioCompleto(titulo, descripcion, preguntas);
                toast.success(
                    'Formulario guardado',
                    `"${titulo}" se ha guardado correctamente con ${preguntas.length} pregunta${preguntas.length > 1 ? 's' : ''}.`
                );
            }
        } catch (error) {
            toast.error(
                'Error al guardar',
                'No se pudo guardar el formulario. Por favor, intenta nuevamente.'
            );
        }
    };

    const handleCancel = () => {
        navigate('/formularios');
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Cargando formulario...</p>
                </div>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-32"> 
            
            {/* Container principal */}
            <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb / Navegación contextual */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button 
                        onClick={() => navigate('/formularios')} 
                        className="hover:text-blue-600 transition-colors"
                    >
                        Formularios
                    </button>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-800 font-medium">
                        {isEditMode ? 'Editar formulario' : 'Nuevo formulario'}
                    </span>
                </nav>
                
                <FormHeader 
                    titulo={titulo} 
                    setTitulo={setTitulo}
                    descripcion={descripcion}
                    setDescripcion={setDescripcion}
                />

                <div className="relative flex items-start gap-5">
                    {/* Lista de Preguntas */}
                    <div className="flex-1 min-w-0 space-y-5">
                        {preguntas.map((pregunta) => (
                            <QuestionCard
                                key={pregunta.id}
                                pregunta={pregunta}
                                isActive={activeQuestionId === pregunta.id}
                                tiposDisponibles={tiposPregunta}
                                onClick={() => setActiveQuestionId(pregunta.id)}
                                onUpdate={updateQuestion}
                                onDelete={deleteQuestion}
                            />
                        ))}
                    </div>

                    {/* Toolbar Flotante (Lateral derecho) */}
                    <div className="hidden md:block sticky top-24 h-fit">
                        <FloatingToolbox onAddQuestion={addQuestion} />
                    </div>
                </div>

                {/* Botón flotante para Móviles */}
                <div className="md:hidden fixed bottom-24 right-5 z-20">
                     <button 
                        onClick={addQuestion}
                        className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-600/25 text-white hover:bg-blue-700 transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>

            </div>

            {/* Footer fijo con acciones */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <p className="text-sm text-gray-500 hidden sm:block">
                        {preguntas.length} {preguntas.length === 1 ? 'pregunta' : 'preguntas'}
                    </p>
                    
                    <div className="flex items-center gap-3 ml-auto">
                        <button 
                            onClick={handleCancel}
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all
                                ${saving ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isEditMode ? 'Actualizando...' : 'Guardando...'}
                                </>
                            ) : (
                                isEditMode ? 'Actualizar' : 'Guardar'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}