import { apiClient } from "../../../core/api.config";
import type { TipoPregunta, TipoPreguntaListResponse } from "../domain/TipoPregunta";

const ENDPOINT = "/tipo-pregunta";

export const TipoPreguntaService = {
    getAll: async (): Promise<TipoPregunta[]> => {
        const { data } = await apiClient.get<TipoPreguntaListResponse>(ENDPOINT);
        
        return data.data.map(item => ({
            id: item.id,
            nombre: item.attributes.nombre
        }));
    },
    
    getById: async (id: string): Promise<TipoPregunta> => {
        const { data } = await apiClient.get<{ data: { id: string, attributes: { nombre: string } } }>(`${ENDPOINT}/${id}`);
        return {
            id: data.data.id,
            nombre: data.data.attributes.nombre
        };
    }
};