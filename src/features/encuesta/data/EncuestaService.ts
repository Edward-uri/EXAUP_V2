import { apiClient } from "../../../core/api.config";
import type { Encuesta } from "../domain/Encuesta";

const ENDPOINT = "/encuestas";

export const EncuestaService = {
    getAll: async (includeRelations = true): Promise<Encuesta[]> => {
        const params = includeRelations 
            ? { include: 'formulario,template-correo' } 
            : {};
        
        const { data } = await apiClient.get(ENDPOINT, { params });
        return data.data;
    },

    getById: async (id: string, includeRelations = true): Promise<Encuesta> => {
        const params = includeRelations 
            ? { include: 'formulario,template-correo' } 
            : {};
        
        const { data } = await apiClient.get(`${ENDPOINT}/${id}`, { params });
        return data.data;
    },

    create: async (
        nombre: string,
        descripcion: string,
        formularioId: string,
        templateId: string
    ) => {
        const payload = {
            data: {
                type: "encuestas",
                attributes: {
                    nombre,
                    descripcion,
                    is_active: true
                },
                relationships: {
                    formulario: {
                        data: { type: "formularios", id: formularioId }
                    },
                    "template-correo": {
                        data: { type: "templates-correo", id: templateId }
                    }
                }
            }
        };

        const { data } = await apiClient.post(ENDPOINT, payload);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    toggleActive: async (id: string, isActive: boolean): Promise<Encuesta> => {
        const payload = {
            data: {
                type: "encuestas",
                id,
                attributes: {
                    is_active: isActive
                }
            }
        };
        
        const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, payload);
        return data.data;
    }
};