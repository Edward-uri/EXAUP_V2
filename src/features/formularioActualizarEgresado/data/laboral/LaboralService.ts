import { apiClient } from "../../../../core/api.config";
import axios from "axios";
import type { DatosLaboralesAttributes, DatosLaboralesResource } from "../../domain/ActualizarEgresado";

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
    let data: { data?: any };
    try {
      const response = await apiClient.get<{ data?: any }>("/datos-laborales");
      data = response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }

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
