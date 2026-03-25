import { apiClient } from "../../../../core/api.config";
import { hasInternalRole, resolveEgresadoPerfilUpdateId } from "../../../../core/auth-context";

const normalizeImageUrl = (url?: string | null): string | null | undefined => {
  if (!url) return url ?? null;
  // Corrige rutas con /uploads/uploads/ a /uploads/
  return url.replace("/uploads/uploads/", "/uploads/");
};

export const EgresadoPerfilService = {
  updatePerfil: async (id: string, data: {
    email?: string;
    fecha_nacimiento?: string;
    imagen_egresado?: string | null;
  }): Promise<void> => {
    const internalRole = hasInternalRole();
    const resolvedId = resolveEgresadoPerfilUpdateId(id);
    const endpoint = internalRole
      ? `/egresado/admin/${resolvedId}/perfil-completo`
      : `/egresado/${resolvedId}/perfil`;

    const payload = {
      data: {
        type: "egresados",
        id: resolvedId,
        attributes: data,
      },
    };

    console.log("[EgresadoPerfilService.updatePerfil] URL", endpoint);
    console.log("[EgresadoPerfilService.updatePerfil] Payload", payload);

    try {
      const response = await apiClient.patch(endpoint, payload);
      console.log("[EgresadoPerfilService.updatePerfil] Success", response.status, response.data);
    } catch (error: any) {
      console.error("[EgresadoPerfilService.updatePerfil] Error status", error?.response?.status);
      console.error("[EgresadoPerfilService.updatePerfil] Error data", error?.response?.data);
      throw error;
    }
  },

  /**
   * Actualiza el perfil completo del egresado enviando la imagen como multipart/form-data.
   * Devuelve la URL de la imagen de perfil que responda el backend.
   */
  updatePerfilConImagen: async (id: string, file: File): Promise<string> => {
    const internalRole = hasInternalRole();
    const resolvedId = resolveEgresadoPerfilUpdateId(id);
    const endpoint = internalRole
      ? `/egresado/admin/${resolvedId}/perfil-completo`
      : `/egresado/${resolvedId}/perfil-completo`;

    const formData = new FormData();
    formData.append("file", file);

    console.log("[EgresadoPerfilService.updatePerfilConImagen] URL", endpoint);

    const response = await apiClient.patch(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const attrs = response.data?.data?.attributes;
    const rawUrl: string | undefined | null = attrs?.imagen_egresado;
    const imagenUrl = normalizeImageUrl(rawUrl);

    if (!imagenUrl) {
      console.error("[EgresadoPerfilService.updatePerfilConImagen] Respuesta sin imagen_egresado", response.data);
      throw new Error("El backend no devolvió la URL de la imagen de perfil");
    }

    console.log("[EgresadoPerfilService.updatePerfilConImagen] Imagen actualizada", imagenUrl);
    return imagenUrl;
  },
};
