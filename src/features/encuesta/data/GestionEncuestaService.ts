import { apiClient } from "../../../core/api.config";
import axios from "axios";
import { ENV } from "../../../core/env.config";
import type { 
    Grupo, 
    Participante, 
    AsignacionResponse, 
    DispatchResponse,
    ParticipantesMeta 
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

// ===== ASIGNACIONES =====
export const AsignacionService = {
    // Asignar por grupo
    asignarPorGrupo: async (encuestaId: string, grupoId: string): Promise<AsignacionResponse> => {
        const payload = {
            data: {
                type: "asignacion",
                attributes: {
                    id_group: parseInt(grupoId)
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
            timeout: 10000
        });
        return data;
    }
};
