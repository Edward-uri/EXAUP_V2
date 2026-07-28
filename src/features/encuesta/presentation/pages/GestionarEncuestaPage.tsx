import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EncuestaService } from '../../data/EncuestaService';
import { ParticipanteService, DistributionService } from '../../data/GestionEncuestaService';
import { TemplateService } from '../../../template/data/TemplateService';
import { AsignarGrupoModal } from '../components/AsignarGrupoModal';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { generatePreviewHtml } from '../../../template/presentation/utils/templateUtils';
import { useAlert } from '../../../../shared/components/Alert';
import type { Encuesta } from '../../domain/Encuesta';
import type { Participante, ParticipantesMeta } from '../../domain/GestionEncuesta';
import {
    PageHeader,
    TabNavigation,
    PreviewTab,
    AsignarTab,
    ParticipantesTab,
    EnviarTab,
    type Tab
} from '../components/gestion';

/**
 * Página para gestionar una encuesta específica.
 * Permite ver vista previa, asignar grupos, gestionar participantes y enviar correos.
 */
export default function GestionarEncuestaPage() {
    const { id } = useParams<{ id: string }>();
    const alert = useAlert();
    
    // Estado de la encuesta actual
    const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('preview');
    
    // Modal de asignación de grupos
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    
    // Estados para la lista de participantes
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [participantesMeta, setParticipantesMeta] = useState<ParticipantesMeta | null>(null);
    const [loadingParticipantes, setLoadingParticipantes] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [participantesFilters, setParticipantesFilters] = useState({
        searchTerm: '',
        filterAcceso: 'activos' as 'todos' | 'activos' | 'revocados',
        filterEstado: 'all' as 'all' | 'pendiente' | 'contestada'
    });
    
    // Estados para el envío de correos
    const [sending, setSending] = useState(false);
    const [filtroEnvio, setFiltroEnvio] = useState<'pendientes' | 'todos'>('pendientes');
    const [currentTemplate, setCurrentTemplate] = useState<any>(null);
    const [selectedGrupoId, setSelectedGrupoId] = useState('');

    // Confirmaciones
    const [confirmState, setConfirmState] = useState<
        | { type: 'revocar'; uuid: string }
        | { type: 'enviar'; filtro: 'pendientes' | 'todos' }
        | null
    >(null);

    useEffect(() => {
        if (id) {
            loadEncuesta();
        }
    }, [id]);

    useEffect(() => {
        if (id && activeTab === 'participantes') {
            loadParticipantes();
        }
    }, [id, activeTab, participantesFilters, currentPage]);

    useEffect(() => {
        if (encuesta && activeTab === 'enviar') {
            loadTemplateContent();
        }
    }, [encuesta, activeTab]);

    /**
     * Cargar los datos de la encuesta desde el servidor
     */
    const loadEncuesta = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await EncuestaService.getById(id, true);
            setEncuesta(data);
        } catch (error) {
            console.error('Error cargando encuesta:', error);
            alert.error('Error al cargar', 'No se pudo cargar la información de la encuesta');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cargar la plantilla de correo asociada a la encuesta
     */
    const loadTemplateContent = async () => {
        if (!encuesta) return;
        const templateId = encuesta.relationships?.['template-correo']?.data.id;
        if (!templateId) return;

        try {
            const template = await TemplateService.getById(templateId);
            setCurrentTemplate(template);
        } catch (error) {
            console.error('Error cargando template:', error);
            alert.error('Error', 'No se pudo cargar la plantilla de correo');
        }
    };


    const loadParticipantes = async () => {
        if (!id) return;
        setLoadingParticipantes(true);
        try {
            const params: any = {
                page: currentPage,
                limit: 20,
                filtro_acceso: participantesFilters.filterAcceso
            };
            
            if (participantesFilters.filterEstado !== 'all') {
                params.estado_respuesta = participantesFilters.filterEstado;
            }
            
            if (participantesFilters.searchTerm.trim()) {
                params.busqueda = participantesFilters.searchTerm;
            }
            
            const response = await ParticipanteService.getParticipantes(id, params);
            setParticipantes(response.data);
            setParticipantesMeta(response.meta);
        } catch (error) {
            console.error('Error cargando participantes:', error);
        } finally {
            setLoadingParticipantes(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    /**
     * Revocar el acceso de un participante a la encuesta
     */
    const handleRevocarParticipante = (uuid: string) => {
        if (!id) return;
        setConfirmState({ type: 'revocar', uuid });
    };

    /**
     * Enviar correos electrónicos a los participantes de la encuesta
     */
    const executeEnviar = async (selectedFiltro: 'pendientes' | 'todos') => {
        if (!id || !encuesta) return;
        if (!selectedGrupoId) {
            alert.warning('Grupo no seleccionado', 'Selecciona un grupo antes de enviar los correos.');
            return;
        }

        setSending(true);
        try {
            const templateId = encuesta.relationships?.['template-correo']?.data.id;
            if (!templateId) {
                alert.warning('Plantilla no encontrada', 'Esta encuesta no tiene plantilla de correo asignada');
                return;
            }

            const response = await DistributionService.dispatch({
                id_encuesta: parseInt(id),
                id_template: parseInt(templateId),
                id_group: parseInt(selectedGrupoId),
                filtro: selectedFiltro,
            });

            alert.success(
                'Envío completado',
                `${response.data.message}. Participantes: ${response.data.total_participants}, Lotes: ${response.data.batches_processed}`
            );

            // Recargar la lista de participantes para ver el estado actualizado
            loadParticipantes();
        } catch (error) {
            console.error('Error enviando correos:', error);
            alert.error('Error en el envio', 'No se pudieron enviar los correos');
        } finally {
            setSending(false);
        }
    };

    const handleEnviar = () => {
        if (!id || !encuesta) return;
        setConfirmState({ type: 'enviar', filtro: filtroEnvio });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!encuesta) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <PageHeader encuesta={encuesta} />

                {/* Tabs */}
                <TabNavigation 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'preview' && (
                        <PreviewTab encuesta={encuesta} />
                    )}

                    {activeTab === 'asignar' && (
                        <AsignarTab onAsignarClick={() => setShowAsignarModal(true)} />
                    )}

                    {activeTab === 'participantes' && (
                        <ParticipantesTab
                            participantes={participantes}
                            participantesMeta={participantesMeta}
                            loading={loadingParticipantes}
                            onRevocar={handleRevocarParticipante}
                            onPageChange={handlePageChange}
                            onFiltersChange={setParticipantesFilters}
                        />
                    )}

                    {activeTab === 'enviar' && encuesta && (
                        <EnviarTab
                            filtroEnvio={filtroEnvio}
                            sending={sending}
                            currentTemplate={currentTemplate}
                            previewHtml={currentTemplate ? generatePreviewHtml(currentTemplate) : ''}
                            onFiltroChange={setFiltroEnvio}
                            onEnviar={handleEnviar}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            <AsignarGrupoModal
                isOpen={showAsignarModal}
                onClose={() => setShowAsignarModal(false)}
                encuestaId={id!}
                onGrupoChange={setSelectedGrupoId}
                onSuccess={() => {
                    setShowAsignarModal(false);
                    if (activeTab === 'participantes') {
                        loadParticipantes();
                    }
                }}
            />

            {/* Confirmaciones universales */}
            <ConfirmModal
                isOpen={!!confirmState}
                title={
                    confirmState?.type === 'revocar'
                        ? 'Revocar acceso'
                        : 'Confirmar envío de correos'
                }
                message={
                    confirmState?.type === 'revocar'
                        ? '¿Estás seguro de revocar el acceso a este participante?'
                        : confirmState?.type === 'enviar' && confirmState.filtro === 'pendientes'
                        ? '¿Enviar correos solo a participantes pendientes?'
                        : '¿Enviar correos a TODOS los participantes?'
                }
                variant={confirmState?.type === 'revocar' ? 'warning' : 'info'}
                onCancel={() => setConfirmState(null)}
                onConfirm={async () => {
                    if (!confirmState) return;
                    if (!id) return;

                    if (confirmState.type === 'revocar') {
                        try {
                            await ParticipanteService.revocarParticipante(id, confirmState.uuid);
                            alert.success('Acceso revocado', 'El participante ya no puede acceder a la encuesta');
                            loadParticipantes();
                        } catch (error) {
                            console.error('Error revocando participante:', error);
                            alert.error('Error', 'No se pudo revocar el acceso');
                        } finally {
                            setConfirmState(null);
                        }
                    } else if (confirmState.type === 'enviar') {
                        await executeEnviar(confirmState.filtro);
                        setConfirmState(null);
                    }
                }}
            />
        </div>
    );
}
