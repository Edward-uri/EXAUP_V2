import { apiClient } from "../../../core/api.config";
import type { Formulario } from "../../formulario/domain/Formulario";
import axios from "axios";
import { ENV } from "../../../core/env.config";
import type { 
    Grupo, 
    Participante, 
    AsignacionResponse, 
    DispatchResponse,
    ParticipantesMeta,
    GrupoAsignado
} from "../domain/GestionEncuesta";

// ===== GRUPOS =====
export const GrupoService = {
    getAll: async (): Promise<Grupo[]> => {
        const { data } = await apiClient.get('/grupo');
        return data.data;
    },

    getById: async (id: string): Promise<Grupo> => {
        const { data } = await apiClient.get(`/grupo/${id}`);
        return data.data;
    }
};

// ===== FORMULARIOS ACTIVOS (F7, usa el filtro de B11) =====
export const FormularioActivoService = {
    getActivos: async (): Promise<Formulario[]> => {
        const { data } = await apiClient.get('/formulario', { params: { activo: 'true', limit: 100 } });
        return Array.isArray(data?.data) ? data.data : [];
    }
};

// ===== ASIGNACIONES =====
export const AsignacionService = {
    // Asignar por grupo
    asignarPorGrupo: async (encuestaId: string, grupoId: string, modo: 'sumar' | 'reemplazar' = 'sumar'): Promise<AsignacionResponse & { meta: { removed?: number } }> => {
        const payload = {
            data: {
                type: "asignacion",
                attributes: {
                    id_group: parseInt(grupoId),
                    modo
                }
            }
        };
        const { data } = await apiClient.post(`/encuestas/${encuestaId}/asignar`, payload);
        return data;
    },

    // Asignar egresados individuales
    asignarEgresados: async (encuestaId: string, egresadosIds: number[]): Promise<AsignacionResponse> => {
        const payload = {
            data: {
                type: "asignacion",
                attributes: {
                    lista_egresados: egresadosIds
                }
            }
        };
        const { data } = await apiClient.post(`/encuestas/${encuestaId}/asignar`, payload);
        return data;
    },

    /**
     * Deja la encuesta únicamente con los miembros del grupo indicado.
     * Usa el modo reemplazar del back (B5), en una sola petición.
     */
    reemplazarPorGrupo: async (
        encuestaId: string,
        grupoId: string
    ): Promise<AsignacionResponse & { revocados: number }> => {
        const res = await AsignacionService.asignarPorGrupo(encuestaId, grupoId, 'reemplazar');
        return { ...res, revocados: res.meta.removed ?? 0 };
    },

    gruposAsignados: async (encuestaId: string): Promise<GrupoAsignado[]> => {
        const { data } = await apiClient.get(`/encuestas/${encuestaId}/grupos`);
        return data?.data ?? [];
    }
};

// ===== PARTICIPANTES =====
interface ParticipantesParams {
    page?: number;
    limit?: number;
    filtro_acceso?: 'activos' | 'revocados' | 'todos';
    estado_respuesta?: 'pendiente' | 'contestada';
    busqueda?: string;
}

export const ParticipanteService = {
    getParticipantes: async (
        encuestaId: string, 
        params: ParticipantesParams = {}
    ): Promise<{ data: Participante[]; meta: ParticipantesMeta }> => {
        const { data } = await apiClient.get(`/encuestas/${encuestaId}/participantes`, { params });
        return data;
    },

    revocarParticipante: async (encuestaId: string, participanteUuid: string): Promise<void> => {
        await apiClient.delete(`/encuestas/${encuestaId}/participantes/${participanteUuid}`);
    },

    revocarTodos: async (encuestaId: string): Promise<number> => {
        const { data } = await apiClient.delete(`/encuestas/${encuestaId}/participantes`);
        return data?.data?.attributes?.revocados ?? 0;
    }
};

// ===== DISTRIBUTION (ENVÍO) =====
interface DispatchParams {
    id_encuesta: number;
    id_template: number;
    id_group?: number;
    filtro?: 'pendientes' | 'todos';
}

export const DistributionService = {
    dispatch: async (params: DispatchParams): Promise<DispatchResponse> => {
        // Este endpoint no usa el prefijo /api, por lo que hacemos la llamada directa
        const baseUrl = ENV.API_URL.replace('/api', '');
        const token = localStorage.getItem('user_access_token');
        
        const { data } = await axios.post(`${baseUrl}/distribution/dispatch`, params, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            timeout: 10000,
            withCredentials: true
        });
        return data;
    }
};
