import { apiClient } from "../../../core/api.config";

export interface OpcionResponse {
    id: string;
    texto: string;
    etiqueta: string;
}

export const PreguntaService = {
    create: async (texto: string, tipoId: string, esObligatoria: boolean): Promise<string> => {
        const payload = {
            data: {
                type: "preguntas",
                attributes: {
                    texto_pregunta: texto,
                    es_obligatoria: esObligatoria
                },
                relationships: {
                    "tipo-pregunta": {
                        data: { 
                            type: "tipos-pregunta", 
                            id: tipoId 
                        }
                    }
                }
            }
        };
        const { data } = await apiClient.post('/pregunta', payload);
        return data.data.id;
    },

    // Actualizar pregunta existente
    update: async (id: string, texto: string, tipoId: string, esObligatoria: boolean): Promise<void> => {
        const payload = {
            data: {
                type: "preguntas",
                attributes: {
                    texto_pregunta: texto,
                    es_obligatoria: esObligatoria
                },
                relationships: {
                    "tipo-pregunta": {
                        data: { 
                            type: "tipos-pregunta", 
                            id: tipoId 
                        }
                    }
                }
            }
        };
        await apiClient.patch(`/pregunta/${id}`, payload);
    },

    asociarAFormulario: async (formularioId: string, preguntaId: string, orden: number) => {
        const payload = {
            data: { id: preguntaId, type: "preguntas" },
            meta: { orden }
        };
        await apiClient.post(`/formulario/${formularioId}/preguntas`, payload);
    },

    createOpcion: async (preguntaId: string, texto: string, etiqueta: string): Promise<string> => {
        const payload = {
            data: {
                type: "opcion-pregunta",
                attributes: {
                    "texto-opcion": texto,
                    etiqueta: etiqueta
                },
                relationships: {
                    pregunta: {
                        data: { type: "pregunta", id: preguntaId }
                    }
                }
            }
        };
        const { data } = await apiClient.post('/opcion-pregunta', payload);
        return data.data.id;
    },

    // Actualizar opción existente
    updateOpcion: async (id: string, texto: string, etiqueta: string, preguntaId: string): Promise<void> => {
        const payload = {
            data: {
                type: "opcion-pregunta",
                attributes: {
                    "texto-opcion": texto,
                    etiqueta: etiqueta
                },
                relationships: {
                    pregunta: {
                        data: { type: "pregunta", id: preguntaId }
                    }
                }
            }
        };
        await apiClient.patch(`/opcion-pregunta/${id}`, payload);
    },

    // Eliminar opción
    deleteOpcion: async (id: string): Promise<void> => {
        await apiClient.delete(`/opcion-pregunta/${id}`);
    }
};