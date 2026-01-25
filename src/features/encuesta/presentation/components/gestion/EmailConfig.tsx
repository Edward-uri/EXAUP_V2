import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { EmailEditor } from '../../../../template/presentation/components/EmailEditor';

interface EmailConfigProps {
    editingTemplate: boolean;
    savingTemplate: boolean;
    templateContent: string;
    filtroEnvio: 'pendientes' | 'todos';
    sending: boolean;
    onTemplateChange: (content: string) => void;
    onEditToggle: (editing: boolean) => void;
    onSaveTemplate: () => void;
    onCancelEdit: () => void;
    onFiltroChange: (filtro: 'pendientes' | 'todos') => void;
    onEnviar: () => void;
}

export function EmailConfig({
    editingTemplate,
    savingTemplate,
    templateContent,
    filtroEnvio,
    sending,
    onTemplateChange,
    onEditToggle,
    onSaveTemplate,
    onCancelEdit,
    onFiltroChange,
    onEnviar
}: EmailConfigProps) {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
            <div className="text-center mb-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <PaperAirplaneIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enviar Encuesta por Correo
                </h3>
                <p className="text-sm text-gray-500">
                    Personaliza y envía correos a los participantes
                </p>
            </div>

            <div className="space-y-6">
                {/* Sección de edición de plantilla de correo */}
                <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-semibold text-gray-900">Contenido del Correo</h4>
                            <p className="text-xs text-gray-600 mt-1">Personaliza el mensaje antes de enviar</p>
                        </div>
                        {!editingTemplate ? (
                            <button
                                onClick={() => onEditToggle(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                Editar Contenido
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={onSaveTemplate}
                                    disabled={savingTemplate}
                                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                                >
                                    {savingTemplate ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button
                                    onClick={onCancelEdit}
                                    className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {editingTemplate ? (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <EmailEditor
                                value={templateContent}
                                onChange={onTemplateChange}
                                placeholder="Escribe el contenido del correo..."
                            />
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
                            <p>Haz clic en "Editar Contenido" para personalizar el mensaje del correo antes de enviarlo a los participantes.</p>
                        </div>
                    )}
                </div>

                {/* Opciones de envío */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Filtro de Envío
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                value="pendientes"
                                checked={filtroEnvio === 'pendientes'}
                                onChange={(e) => onFiltroChange(e.target.value as typeof filtroEnvio)}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Solo Pendientes</div>
                                <div className="text-sm text-gray-500">
                                    Enviar únicamente a quienes no han contestado
                                </div>
                            </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                value="todos"
                                checked={filtroEnvio === 'todos'}
                                onChange={(e) => onFiltroChange(e.target.value as typeof filtroEnvio)}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Todos los Participantes</div>
                                <div className="text-sm text-gray-500">
                                    Enviar a todos, incluyendo quienes ya contestaron
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Botón de envío */}
                <div className="pt-4">
                    <button
                        onClick={onEnviar}
                        disabled={sending || editingTemplate}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {editingTemplate ? 'Guarda antes de enviar' : 'Enviar Correos'}
                            </>
                        )}
                    </button>
                </div>

                {/* Info adicional */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Proceso de envío</p>
                            <ul className="text-blue-700 space-y-1 list-disc list-inside">
                                <li>Los correos se envían en lotes para mayor eficiencia</li>
                                <li>Cada participante recibirá un link único de acceso</li>
                                <li>Podrás ver el progreso de respuestas en la pestaña Participantes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
