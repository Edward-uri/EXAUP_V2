import { TrashIcon, DocumentDuplicateIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Pregunta,OpcionPregunta } from '../../domain/Pregunta';
import type { TipoPregunta } from '../../domain/TipoPregunta';

// Mapeo para mostrar nombres amigables y descripciones
const TIPO_PREGUNTA_CONFIG: Record<string, { label: string; descripcion: string }> = {
    'abierta': { 
        label: 'Respuesta abierta', 
        descripcion: 'Texto libre' 
    },
    'opción múltiple': { 
        label: 'Opción múltiple', 
        descripcion: 'Una sola respuesta' 
    },
    'boolean': { 
        label: 'Sí / No', 
        descripcion: 'Verdadero o falso' 
    },
    'likert': { 
        label: 'Escala Likert', 
        descripcion: 'Nivel de acuerdo' 
    },
    'casillas': { 
        label: 'Casillas', 
        descripcion: 'Varias respuestas' 
    },
};

// Función helper para obtener el label amigable
const getTipoLabel = (nombre: string): string => {
    const normalizado = nombre.toLowerCase().trim();
    return TIPO_PREGUNTA_CONFIG[normalizado]?.label || capitalizar(nombre);
};

const getTipoDescripcion = (nombre: string): string => {
    const normalizado = nombre.toLowerCase().trim();
    return TIPO_PREGUNTA_CONFIG[normalizado]?.descripcion || '';
};

const capitalizar = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interface QuestionCardProps {
    pregunta: Pregunta;
    isActive: boolean;
    tiposDisponibles: TipoPregunta[]; 
    onClick: () => void;
    onUpdate: (id: string, field: keyof Pregunta, value: any) => void;
    onDelete: (id: string) => void;
}

export const QuestionCard = ({ pregunta, isActive, tiposDisponibles, onClick, onUpdate, onDelete }: QuestionCardProps) => {

    // --- LÓGICA DE OPCIONES ---
    const handleAddOption = () => {
        const currentOptions = pregunta.opciones || [];
        const newOption: OpcionPregunta = { texto: `Opción ${currentOptions.length + 1}` };
        onUpdate(pregunta.id, 'opciones', [...currentOptions, newOption]);
    };

    const handleUpdateOption = (index: number, val: string) => {
        const currentOptions = [...(pregunta.opciones || [])];
        currentOptions[index].texto = val;
        onUpdate(pregunta.id, 'opciones', currentOptions);
    };

    const handleRemoveOption = (index: number) => {
        const currentOptions = [...(pregunta.opciones || [])];
        currentOptions.splice(index, 1);
        onUpdate(pregunta.id, 'opciones', currentOptions);
    };

    // Helper para saber qué renderizar visualmente buscando el nombre del tipo seleccionado
    const tipoSeleccionado = tiposDisponibles.find(t => t.id === pregunta.tipoId)?.nombre.toLowerCase() || '';
    const esOpcionMultiple = tipoSeleccionado.includes('múltiple') || tipoSeleccionado.includes('multiple');
    const esCasillas = tipoSeleccionado.includes('casilla') || tipoSeleccionado.includes('check');
    const esTextoCorto = tipoSeleccionado.includes('abierta') || tipoSeleccionado.includes('texto') || tipoSeleccionado.includes('corto');
    const esBoolean = tipoSeleccionado.includes('boolean');
    const esLikert = tipoSeleccionado.includes('likert');

    // Obtener el label del tipo para mostrar en vista previa
    const tipoLabel = tiposDisponibles.find(t => t.id === pregunta.tipoId)?.nombre 
        ? getTipoLabel(tiposDisponibles.find(t => t.id === pregunta.tipoId)!.nombre) 
        : '';
    
    // --- VISTA PREVIA (INACTIVA) ---
    if (!isActive) {
        return (
            <div 
                onClick={onClick}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 px-7 py-5 cursor-pointer hover:border-gray-200 hover:shadow-md transition-all duration-200"
            >
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                        <h3 className="text-base text-gray-800 font-medium leading-relaxed">
                            {pregunta.texto || <span className="text-gray-400 italic">Pregunta sin título</span>}
                        </h3>
                        {tipoLabel && (
                            <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                {tipoLabel}
                            </span>
                        )}
                    </div>
                    {pregunta.es_requerida && <span className="text-red-500 text-lg font-medium">*</span>}
                </div>
                
                <div className="mt-4 pointer-events-none opacity-60">
                    {esTextoCorto && (
                        <div className="border-b border-dotted border-gray-300 w-1/2 h-8 text-sm text-gray-400 pt-2">Texto de respuesta</div>
                    )}
                    {esBoolean && (
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <span className="text-sm text-gray-500">Sí</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <span className="text-sm text-gray-500">No</span>
                            </div>
                        </div>
                    )}
                    {esLikert && (
                        <div className="flex gap-2">
                            {['1', '2', '3', '4', '5'].map(n => (
                                <div key={n} className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400">
                                    {n}
                                </div>
                            ))}
                        </div>
                    )}
                    {(esOpcionMultiple || esCasillas) && (
                        <ul className="space-y-2">
                            {(pregunta.opciones || []).slice(0, 2).map((op, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <div className={`w-4 h-4 border-2 border-gray-300 ${esOpcionMultiple ? 'rounded-full' : 'rounded'}`}></div> 
                                    <span className="text-sm text-gray-500">{op.texto}</span>
                                </li>
                            ))}
                            {(pregunta.opciones?.length || 0) > 2 && <li className="text-xs text-gray-400 pl-7">... más opciones</li>}
                        </ul>
                    )}
                </div>
            </div>
        );
    }

    // --- VISTA EDICIÓN (ACTIVA) ---
    return (
        <div className="bg-white rounded-xl shadow-lg border-l-[6px] border-l-blue-600 px-7 py-6 transition-all duration-200 ring-1 ring-gray-100 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                {/* Input Pregunta */}
                <div className="md:col-span-7 lg:col-span-8 bg-gray-50 px-4 py-3 rounded-lg border-b-2 border-gray-300 focus-within:border-blue-600 focus-within:bg-blue-50/30 transition-all duration-200">
                    <input
                        type="text"
                        className="w-full bg-transparent border-none p-0 text-base text-gray-900 focus:ring-0 focus:outline-none placeholder:text-gray-400"
                        placeholder="Escribe tu pregunta aquí"
                        value={pregunta.texto}
                        onChange={(e) => onUpdate(pregunta.id, 'texto', e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Select Tipo de Pregunta (DINÁMICO) */}
                <div className="md:col-span-5 lg:col-span-4">
                    <select
                        className="block w-full rounded-lg border-0 py-3 px-4 text-gray-700 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:outline-none text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100"
                        value={pregunta.tipoId}
                        onChange={(e) => onUpdate(pregunta.id, 'tipoId', e.target.value)}
                    >
                        <option value="" disabled>Selecciona un tipo de pregunta</option>
                        {tiposDisponibles.map(tipo => {
                            const label = getTipoLabel(tipo.nombre);
                            const desc = getTipoDescripcion(tipo.nombre);
                            return (
                                <option key={tipo.id} value={tipo.id}>
                                    {label}{desc ? ` — ${desc}` : ''}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Área de opciones DINÁMICA */}
            <div className="mt-6">
                {(esOpcionMultiple || esCasillas) && (
                    <div className="space-y-3 pl-1">
                        {(pregunta.opciones || []).map((opcion, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                                <div className={`w-4 h-4 border-2 border-gray-300 group-hover:border-gray-400 transition-colors ${esOpcionMultiple ? 'rounded-full' : 'rounded'}`}></div>
                                <input 
                                    type="text" 
                                    value={opcion.texto}
                                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                                    className="flex-1 text-sm text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-0 py-1 transition-colors bg-transparent"
                                    placeholder={`Opción ${index + 1}`}
                                />
                                <button 
                                    onClick={() => handleRemoveOption(index)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        {/* Botón Añadir Opción */}
                        <div className="flex items-center gap-3 mt-2">
                             <div className={`w-4 h-4 border-2 border-dashed border-gray-300 ${esOpcionMultiple ? 'rounded-full' : 'rounded'}`}></div>
                             <button 
                                onClick={handleAddOption}
                                className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium transition-colors"
                             >
                                + Añadir opción
                             </button>
                        </div>
                    </div>
                )}

                {esTextoCorto && (
                    <div className="border-b border-dotted border-gray-300 w-1/2 py-2 text-sm text-gray-400 mt-2">
                        Texto de respuesta del usuario...
                    </div>
                )}

                {esBoolean && (
                    <div className="flex gap-6 mt-2">
                        <div className="flex items-center gap-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors"></div>
                            <span className="text-sm text-gray-600">Sí</span>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors"></div>
                            <span className="text-sm text-gray-600">No</span>
                        </div>
                    </div>
                )}

                {esLikert && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-3">Escala del 1 al 5 (Totalmente en desacuerdo → Totalmente de acuerdo)</p>
                        <div className="flex gap-3">
                            {[
                                { val: '1', label: 'Muy en desacuerdo' },
                                { val: '2', label: 'En desacuerdo' },
                                { val: '3', label: 'Neutral' },
                                { val: '4', label: 'De acuerdo' },
                                { val: '5', label: 'Muy de acuerdo' },
                            ].map(item => (
                                <div key={item.val} className="flex flex-col items-center gap-1 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm text-gray-500 group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                                        {item.val}
                                    </div>
                                    <span className="text-[10px] text-gray-400 text-center max-w-[60px] hidden sm:block">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer de Acciones */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <button title="Duplicar" className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <DocumentDuplicateIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onDelete(pregunta.id)}
                    title="Eliminar" 
                    className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                
                <div className="h-8 w-px bg-gray-200 mx-1 sm:mx-3"></div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Obligatorio</span>
                    <button
                        onClick={() => onUpdate(pregunta.id, 'es_requerida', !pregunta.es_requerida)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-inner ${pregunta.es_requerida ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${pregunta.es_requerida ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};