import { apiClient } from "../../../../core/api.config";

export const EgresadoPerfilService = {
  updatePerfil: async (id: string, data: {
    email?: string;
    fecha_nacimiento?: string;
    imagen_egresado?: string | null;
  }): Promise<void> => {
    const payload = {
      data: {
        type: "egresados",
        id,
        attributes: data,
      },
    };

    console.log("[EgresadoPerfilService.updatePerfil] URL", `/egresado/${id}/perfil`);
    console.log("[EgresadoPerfilService.updatePerfil] Payload", payload);

    try {
      const response = await apiClient.patch(`/egresado/${id}/perfil`, payload);
      console.log("[EgresadoPerfilService.updatePerfil] Success", response.status, response.data);
    } catch (error: any) {
      console.error("[EgresadoPerfilService.updatePerfil] Error status", error?.response?.status);
      console.error("[EgresadoPerfilService.updatePerfil] Error data", error?.response?.data);
      throw error;
    }
  },
};
