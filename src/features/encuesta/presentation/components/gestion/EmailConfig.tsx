import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface EmailConfigProps {
    filtroEnvio: 'pendientes' | 'todos';
    sending: boolean;
    onFiltroChange: (filtro: 'pendientes' | 'todos') => void;
    onEnviar: () => void;
}

export function EmailConfig({
    filtroEnvio,
    sending,
    onFiltroChange,
    onEnviar
}: EmailConfigProps) {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 shrink-0">
                    <PaperAirplaneIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Enviar Encuesta por Correo
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Elige a quién enviar y confirma el lote de distribución.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Opciones de envío */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Filtro de Envío
                    </label>
                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${filtroEnvio === 'pendientes' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
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
                        <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${filtroEnvio === 'todos' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
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
                <div className="pt-2">
                    <button
                        onClick={onEnviar}
                        disabled={sending}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Enviar Correos
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
