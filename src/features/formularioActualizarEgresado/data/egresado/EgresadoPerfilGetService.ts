import { apiClient } from "../../../../core/api.config";

export interface EgresadoPerfilAttributes {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  fecha_nacimiento?: string;
  email?: string;
  imagen_egresado?: string | null;
}

export interface EgresadoPerfilResource {
  id: string;
  attributes: EgresadoPerfilAttributes;
}

export const EgresadoPerfilGetService = {
  /**
   * Obtiene el perfil del egresado autenticado.
   * El backend puede devolver distintos nombres para apellidos,
   * por eso se incluyen ambas variantes en los atributos.
   */
  getPerfilActual: async (): Promise<EgresadoPerfilResource | null> => {
    const { data } = await apiClient.get<{ data?: any }>("/egresado/perfil");

    if (!data || !data.data) {
      return null;
    }

    const resource = data.data;

    return {
      id: String(resource.id),
      attributes: resource.attributes ?? {},
    };
  },
};
