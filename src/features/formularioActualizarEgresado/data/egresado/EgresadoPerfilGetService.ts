import { apiClient } from "../../../../core/api.config";
import { normalizeImageUrl } from "../../../../core/media";
import type { EgresadoPerfilAttributes, EgresadoPerfilResource } from "../../domain/ActualizarEgresado";

interface PerfilCompletoResponse {
  success: boolean;
  data?: {
    egresado?: {
      id?: number;
      nombre?: string;
      primer_apellido?: string;
      segundo_apellido?: string | null;
      email?: string | null;
      imagen_egresado?: string | null;
      fecha_nacimiento?: string | null;
    };
  };
}

export const EgresadoPerfilGetService = {
  /**
   * Obtiene el perfil completo del egresado por id usando /egresado/{id}/perfil-completo.
   * Normaliza los campos al shape de EgresadoPerfilResource.
   */
  getPerfilActual: async (id: string): Promise<EgresadoPerfilResource | null> => {
    const { data } = await apiClient.get<PerfilCompletoResponse>(`/egresado/${id}/perfil-completo`);

    const eg = data?.data?.egresado;
    if (!eg) {
      return null;
    }

    const attrs: EgresadoPerfilAttributes = {
      nombre: eg.nombre,
      primer_apellido: eg.primer_apellido,
      segundo_apellido: eg.segundo_apellido ?? undefined,
      // También llenamos las variantes *_paterno/*_materno para compatibilidad
      apellido_paterno: eg.primer_apellido,
      apellido_materno: eg.segundo_apellido ?? undefined,
      email: eg.email ?? undefined,
      fecha_nacimiento: eg.fecha_nacimiento ?? undefined,
      imagen_egresado: normalizeImageUrl(eg.imagen_egresado) ?? null,
    };

    return {
      id: String(eg.id ?? id),
      attributes: attrs,
    };
  },
};
