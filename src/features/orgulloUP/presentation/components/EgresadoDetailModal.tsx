import { XMarkIcon, BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { OrgulloUPRecord } from '../../domain/OrgulloUP';
import { useState } from 'react';
import { OrgulloUPService } from '../../data/OrgulloUPService';
import { useToast } from '../../../../shared/components/Toast';

interface EgresadoDetailModalProps {
    isOpen: boolean;
    record: OrgulloUPRecord | null;
    onClose: () => void;
    onUpdate?: () => void;
}

export function EgresadoDetailModal({ isOpen, record, onClose, onUpdate }: EgresadoDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [updatedRecord, setUpdatedRecord] = useState<OrgulloUPRecord | null>(null);
    const toast = useToast();
    
    if (!isOpen || !record) return null;

    // Usar el record actualizado si existe, sino el original
    const currentRecord = updatedRecord || record;
    const { egresado, logros_academicos = [], logros_laborales = [], status } = currentRecord.attributes;
    const nombreCompleto = `${egresado.nombre} ${egresado.primer_apellido} ${egresado.segundo_apellido || ''}`.trim();

    // Inicializar datos de edición
    const startEditing = () => {
        setEditData({
            nombre: egresado.nombre,
            primer_apellido: egresado.primer_apellido,
            segundo_apellido: egresado.segundo_apellido,
            curp: egresado.curp,
            email: egresado.email,
            fecha_nacimiento: egresado.fecha_nacimiento,
            id_programa_educativo: egresado.id_programa_educativo
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const saveChanges = async () => {
        if (!editData) return;
        
        setIsSaving(true);
        try {
            await OrgulloUPService.updatePerfil(record.id, editData);
            
            // Actualizar el registro local
            setUpdatedRecord({
                ...currentRecord,
                attributes: {
                    ...currentRecord.attributes,
                    egresado: {
                        ...currentRecord.attributes.egresado,
                        ...editData
                    }
                }
            });
            
            setIsEditing(false);
            setEditData(null);
            toast.success('Perfil actualizado', 'Los datos del egresado se han actualizado correctamente.');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.error('Error al actualizar', 'No se pudo actualizar el perfil del egresado. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const mapEstadoToStatus = (estado: 1 | 2 | 3): 'pendiente' | 'rechazado' | 'aprobado' => {
        switch (estado) {
            case 1: return 'pendiente';
            case 2: return 'rechazado';
            case 3: return 'aprobado';
            default: return 'pendiente';
        }
    };

    const handleEstadoChange = async (estado: 1 | 2 | 3) => {
        const estadoTexto = estado === 1 ? 'Pendiente' : estado === 2 ? 'Rechazado' : 'Aprobado';
        
        setIsSaving(true);
        try {
            await OrgulloUPService.updateEstado(record.id, estado);
            
            // Actualizar el registro local con el nuevo estado
            setUpdatedRecord({
                ...currentRecord,
                attributes: {
                    ...currentRecord.attributes,
                    status: mapEstadoToStatus(estado)
                }
            });
            
            toast.success('Estado actualizado', `El estado del egresado se cambió a "${estadoTexto}".`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar', 'No se pudo cambiar el estado del egresado. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const getEstadoActual = (): 1 | 2 | 3 => {
        if (status === 'pendiente') return 1;
        if (status === 'rechazado') return 2;
        if (status === 'aprobado') return 3;
        return 1; // default
    };

    const estadoActual = getEstadoActual();

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
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isEditing ? 'Editar Perfil' : nombreCompleto}
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={startEditing}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Editar perfil"
                                    >
                                        <PencilIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 text-left max-w-md mx-auto mt-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={editData.nombre}
                                            onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Apellido</label>
                                        <input
                                            type="text"
                                            value={editData.primer_apellido}
                                            onChange={(e) => setEditData({...editData, primer_apellido: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Apellido</label>
                                        <input
                                            type="text"
                                            value={editData.segundo_apellido || ''}
                                            onChange={(e) => setEditData({...editData, segundo_apellido: e.target.value || null})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">CURP</label>
                                        <input
                                            type="text"
                                            value={editData.curp}
                                            onChange={(e) => setEditData({...editData, curp: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={editData.email || ''}
                                            onChange={(e) => setEditData({...editData, email: e.target.value || null})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            value={editData.fecha_nacimiento || ''}
                                            onChange={(e) => setEditData({...editData, fecha_nacimiento: e.target.value || null})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={saveChanges}
                                            disabled={isSaving}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSaving ? 'Guardando...' : 'Guardar'}
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            disabled={isSaving}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-4">{egresado.email || 'Sin correo'}</p>
                                    <div className="flex justify-center gap-4 flex-wrap">
                                        <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                            <p className="text-xs text-gray-600 font-semibold">MATRÍCULA</p>
                                            <p className="text-sm font-bold text-blue-600">{egresado.matricula}</p>
                                        </div>
                                        <div className="bg-purple-50 px-4 py-2 rounded-lg">
                                            <p className="text-xs text-gray-600 font-semibold">CURP</p>
                                            <p className="text-sm font-bold text-purple-600">{egresado.curp || '-'}</p>
                                        </div>
                                        <div className="bg-green-50 px-4 py-2 rounded-lg">
                                            <p className="text-xs text-gray-600 font-semibold">PERÍODO</p>
                                            <p className="text-sm font-bold text-green-600">{egresado.id_periodo || '-'}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Botones de Estado */}
                        {!isEditing && (
                            <div className="mb-8">
                                <p className="text-sm font-semibold text-gray-600 text-center mb-3">Estado del Egresado</p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => handleEstadoChange(1)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                                            estadoActual === 1
                                                ? 'bg-yellow-600 text-white shadow-lg'
                                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Pendiente
                                    </button>
                                    <button
                                        onClick={() => handleEstadoChange(2)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                                            estadoActual === 2
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <XCircleIcon className="w-4 h-4" />
                                        Rechazado
                                    </button>
                                    <button
                                        onClick={() => handleEstadoChange(3)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                                            estadoActual === 3
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Aprobado
                                    </button>
                                </div>
                            </div>
                        )}

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
