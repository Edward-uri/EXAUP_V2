import { apiClient, getAuthHeaders } from '../../../core/api.config';
import type { 
    AutomaticEvent, 
    CreateEventRequest, 
    UpdateEventRequest, 
    EventRun 
} from '../domain/AutomaticEvent';

const ENDPOINT = '/automatic-events';

export const AutomaticEventService = {
    getAll: async (): Promise<AutomaticEvent[]> => {
        const { data } = await apiClient.get<{ data: AutomaticEvent[] }>(ENDPOINT, {
            headers: getAuthHeaders()
        });
        return data.data;
    },

    getById: async (id: string | number): Promise<AutomaticEvent> => {
        const { data } = await apiClient.get<{ data: AutomaticEvent }>(`${ENDPOINT}/${id}`, {
            headers: getAuthHeaders()
        });
        return data.data;
    },

    create: async (payload: CreateEventRequest): Promise<void> => {
        await apiClient.post(ENDPOINT, payload, {
            headers: getAuthHeaders()
        });
    },

    update: async (id: string | number, payload: UpdateEventRequest): Promise<void> => {
        await apiClient.patch(`${ENDPOINT}/${id}`, payload, {
            headers: getAuthHeaders()
        });
    },

    activate: async (id: string | number): Promise<void> => {
        await apiClient.patch(`${ENDPOINT}/${id}/activate`, {}, {
            headers: getAuthHeaders()
        });
    },

    deactivate: async (id: string | number): Promise<void> => {
        await apiClient.patch(`${ENDPOINT}/${id}/deactivate`, {}, {
            headers: getAuthHeaders()
        });
    },

    trigger: async (id: string | number): Promise<void> => {
        await apiClient.post(`${ENDPOINT}/${id}/trigger`, {}, {
            headers: getAuthHeaders()
        });
    },

    getRuns: async (id: string | number): Promise<EventRun[]> => {
        const { data } = await apiClient.get<{ data: EventRun[] }>(`${ENDPOINT}/${id}/runs`, {
            headers: getAuthHeaders()
        });
        return data.data;
    }
};
