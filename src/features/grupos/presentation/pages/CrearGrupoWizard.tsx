import { useNavigate } from 'react-router-dom';
import { useCrearGrupoWizard } from '../hooks/useCrearGrupoWizard';
import { ROUTES } from '../../../../constants/routes';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CrearGrupoWizard() {
    const navigate = useNavigate();
    const wizard = useCrearGrupoWizard();

    const handleConfirm = async () => {
        const success = await wizard.submit();
        if (success) {
            navigate(ROUTES.GRUPOS);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(ROUTES.GRUPOS)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">
                            Crear Nuevo Grupo
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Paso {wizard.step} de 4
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
                    {wizard.step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">1. Información Básica</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre del grupo</label>
                                <input
                                    type="text"
                                    value={wizard.nombre}
                                    onChange={(e) => wizard.setNombre(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                                    placeholder="Ej. Egresados 2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={wizard.descripcion}
                                    onChange={(e) => wizard.setDescripcion(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {wizard.step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">2. Filtros de Búsqueda</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Programa Educativo</label>
                                    <select
                                        value={wizard.filtros.id_programa_educativo || ''}
                                        onChange={(e) => wizard.setFiltros({ ...wizard.filtros, id_programa_educativo: e.target.value ? Number(e.target.value) : undefined })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                                    >
                                        <option value="">Todos los programas</option>
                                        {wizard.programas.map(p => (
                                            <option key={p.id_programa_educativo} value={p.id_programa_educativo}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cohorte generacional</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. 113"
                                        value={wizard.filtros.prefijo_matricula || ''}
                                        onChange={(e) => wizard.setFiltros({ ...wizard.filtros, prefijo_matricula: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Búsqueda libre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre, correo..."
                                        value={wizard.filtros.busqueda || ''}
                                        onChange={(e) => wizard.setFiltros({ ...wizard.filtros, busqueda: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {wizard.step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">3. Previsualización de Egresados</h2>
                            {wizard.loadingPreview ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Se han encontrado <span className="font-bold text-blue-600">{wizard.totalMatches}</span> egresados con estos filtros.
                                    </p>
                                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Matrícula</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Programa</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {wizard.egresadosPreview.map(e => (
                                                    <tr key={e.id_egresado}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{e.nombre} {e.primer_apellido}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">{e.matricula}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">{e.programa_educativo}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Mostrando hasta 20 resultados de muestra</p>
                                </div>
                            )}
                        </div>
                    )}

                    {wizard.step === 4 && (
                        <div className="space-y-4 text-center py-8">
                            <h2 className="text-xl font-semibold">Resumen de Importación</h2>
                            <div className="bg-blue-50 text-blue-800 p-6 rounded-lg inline-block text-left w-full max-w-md mx-auto">
                                <p><strong>Grupo:</strong> {wizard.nombre}</p>
                                <p><strong>Total de egresados a importar:</strong> {wizard.totalMatches}</p>
                            </div>
                            <p className="text-gray-600 mt-4">¿Estás listo para crear el grupo e importar los miembros?</p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={wizard.prevStep}
                            disabled={wizard.step === 1 || wizard.isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        {wizard.step < 4 ? (
                            <button
                                type="button"
                                onClick={wizard.nextStep}
                                disabled={wizard.step === 1 && (!wizard.nombre.trim() || !wizard.descripcion.trim())}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={wizard.isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                            >
                                {wizard.isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Importando...
                                    </>
                                ) : (
                                    'Confirmar e Importar'
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}