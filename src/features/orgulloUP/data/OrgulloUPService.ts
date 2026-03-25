import { apiClient } from "../../../core/api.config";
import type { PerfilActualizable } from "../domain/OrgulloUP";

export const OrgulloUPService = {
    updateEstado: async (id: string, estado: 1 | 2 | 3): Promise<void> => {
        const payload = {
            data: {
                type: 'egresados',
                id: id,
                attributes: {
                    id_estado: estado
                }
            }
        };
        await apiClient.patch(`/egresado/${id}/estado`, payload);
    },

    updatePerfil: async (id: string, perfilData: PerfilActualizable): Promise<void> => {
        const payload = {
            data: {
                type: 'egresados',
                id: id,
                attributes: perfilData
            }
        };
        await apiClient.patch(`/egresado/admin/${id}/perfil-completo`, payload);
    },
};

