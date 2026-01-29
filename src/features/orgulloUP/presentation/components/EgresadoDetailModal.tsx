import { XMarkIcon, BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { OrgulloUPRecord } from '../../domain/OrgulloUP';

interface EgresadoDetailModalProps {
    isOpen: boolean;
    record: OrgulloUPRecord | null;
    onClose: () => void;
    onToggleStatus?: (id: string, isActive: boolean) => void;
}

export function EgresadoDetailModal({ isOpen, record, onClose, onToggleStatus }: EgresadoDetailModalProps) {
    if (!isOpen || !record) return null;

    const { egresado, logros_academicos = [], logros_laborales = [], status } = record.attributes;
    const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido || ''}`.trim();
    const isActive = egresado.is_active;

    const handleToggleStatus = (newStatus: boolean) => {
        if (onToggleStatus) {
            onToggleStatus(record.id, newStatus);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-out"
                onClick={onClose}
                style={{
                    animation: 'fadeIn 0.3s ease-out'
                }}
            />

            {/* Modal */}
            <div
                className="fixed top-0 right-0 bottom-0 left-64 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header con imagen */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden flex-shrink-0">
                        {egresado.imagen_egresado ? (
                            <img
                                src={egresado.imagen_egresado}
                                alt={nombreCompleto}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                                <div className="w-24 h-24 bg-blue-300 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">
                                        {egresado.nombre.charAt(0)}{egresado.primer_apellido.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto flex-1">
                        {/* Nombre y info básica */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {nombreCompleto}
                            </h2>
                            <p className="text-gray-500 mb-4">{egresado.email || 'Sin correo'}</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                    <p className="text-xs text-gray-600 font-semibold">MATRÍCULA</p>
                                    <p className="text-sm font-bold text-blue-600">{egresado.matricula}</p>
                                </div>
                                <div className="bg-green-50 px-4 py-2 rounded-lg">
                                    <p className="text-xs text-gray-600 font-semibold">PERÍODO</p>
                                    <p className="text-sm font-bold text-green-600">{egresado.id_periodo || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Estado */}
                        <div className="mb-8 flex justify-center gap-4">
                            <button
                                onClick={() => handleToggleStatus(true)}
                                disabled={isActive}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                    isActive
                                        ? 'bg-green-600 text-white shadow-lg cursor-default'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                }`}
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                {isActive ? 'Activo' : 'Activar'}
                            </button>
                            <button
                                onClick={() => handleToggleStatus(false)}
                                disabled={!isActive}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                    !isActive
                                        ? 'bg-red-600 text-white shadow-lg cursor-default'
                                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                }`}
                            >
                                <XCircleIcon className="w-5 h-5" />
                                {!isActive ? 'Inactivo' : 'Desactivar'}
                            </button>
                        </div>

                        {/* Logros Académicos */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Logros Académicos</h3>
                            </div>
                            {logros_academicos.length > 0 ? (
                                <div className="space-y-3">
                                    {logros_academicos.map((logro) => (
                                        <div
                                            key={logro.id_academic_achievement}
                                            className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                                        >
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {logro.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">{logro.institution}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(logro.date).toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Sin logros académicos registrados
                                </p>
                            )}
                        </div>

                        {/* Logros Laborales */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BriefcaseIcon className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Logros Laborales</h3>
                            </div>
                            {logros_laborales.length > 0 ? (
                                <div className="space-y-3">
                                    {logros_laborales.map((logro) => (
                                        <div
                                            key={logro.id_labor_achievement}
                                            className="bg-green-50 p-4 rounded-lg border border-green-100"
                                        >
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {logro.position}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">{logro.company}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(logro.date).toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Sin logros laborales registrados
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
