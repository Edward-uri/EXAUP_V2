import { apiClient } from "../../../core/api.config";
const ENDPOINT = "/encuestas";

export const EncuestaService = {
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
    }
};