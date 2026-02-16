import { apiClient } from "../../../../core/api.config";

export interface DatosLaboralesAttributes {
  trabaja_actualmente?: boolean;
  nombre_empresa?: string;
  puesto?: string;
  id_sector?: number | null;
  actividad_principal?: string;
}

export interface DatosLaboralesResource {
  id: string;
  attributes: DatosLaboralesAttributes;
}

export const LaboralService = {
  createDatosLaborales: async (data: DatosLaboralesAttributes): Promise<void> => {
    const payload = {
      data: {
        type: "datos-laborales",
        attributes: data,
      },
    };

    await apiClient.post("/datos-laborales", payload);
  },

  getDatosLaborales: async (): Promise<DatosLaboralesResource | null> => {
    const { data } = await apiClient.get<{ data?: any }>("/datos-laborales");

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

  updateDatosLaborales: async (data: DatosLaboralesAttributes): Promise<void> => {
    const payload = {
      data: {
        type: "datos-laborales",
        attributes: data,
      },
    };

    await apiClient.patch("/datos-laborales", payload);
  },
};
