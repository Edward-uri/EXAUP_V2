import { apiClient } from "../../../../core/api.config";

export interface DomicilioAttributes {
  calle?: string;
  colonia?: string;
  numero_exterior?: string;
  codigo_postal?: string;
  estado?: string;
  ciudad?: string;
}

export interface DomicilioResource {
  id: string;
  attributes: DomicilioAttributes;
}

export const DomicilioService = {
  createDatosDomiciliarios: async (data: DomicilioAttributes): Promise<void> => {
    const payload = {
      data: {
        type: "datos-domiciliarios",
        attributes: data,
      },
    };

    await apiClient.post("/datos-domiciliarios", payload);
  },

  getDatosDomiciliarios: async (): Promise<DomicilioResource | null> => {
    const { data } = await apiClient.get<{ data?: any }>("/datos-domiciliarios");

    if (!data || !data.data) {
      return null;
    }

    const resource = Array.isArray(data.data) ? data.data[0] : data.data;
    if (!resource) return null;

    return {
      id: String(resource.id),
      attributes: resource.attributes ?? {},
    };
  },

  updateDatosDomiciliarios: async (id: string, data: DomicilioAttributes): Promise<void> => {
    const payload = {
      data: {
        type: "datos-domiciliarios",
        // El backend identifica al egresado autenticado,
        // no requiere el id de domicilio en la URL
        id,
        attributes: data,
      },
    };

    await apiClient.patch("/datos-domiciliarios", payload);
  },
};
