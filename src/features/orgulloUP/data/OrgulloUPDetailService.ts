import { apiClient } from "../../../core/api.config";
import type { LogroAcademico, LogroLaboral } from "../domain/OrgulloUP";

export const OrgulloUPDetailService = {
  // Obtiene solo la sinopsis profesional del egresado
  getSinopsis: async (id: string): Promise<string | null> => {
    try {
      const { data } = await apiClient.get<{
        data?: { attributes?: { sinopsis?: string | null } };
      }>(`/egresado/${id}/sinopsis`);

      const sinopsis = data?.data?.attributes?.sinopsis;
      if (!sinopsis || typeof sinopsis !== "string") {
        return null;
      }
      return sinopsis;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getLogrosAcademicos: async (id: string): Promise<LogroAcademico[]> => {
    const { data } = await apiClient.get<{ data?: any }>(
      `/egresado/${id}/logros-academicos`,
    );

    if (!data || !data.data) {
      return [];
    }

    const resources = Array.isArray(data.data) ? data.data : [];

    return resources.map(
      (item: any): LogroAcademico => ({
        id_academic_achievement: Number(item.id),
        name: item.attributes?.titulo ?? "",
        institution: item.attributes?.institucion ?? "",
        date: item.attributes?.fecha ?? "",
      }),
    );
  },

  getLogrosLaborales: async (id: string): Promise<LogroLaboral[]> => {
    const { data } = await apiClient.get<{ data?: any }>(
      `/egresado/${id}/logros-laborales`,
    );

    if (!data || !data.data) {
      return [];
    }

    const resources = Array.isArray(data.data) ? data.data : [];

    return resources.map(
      (item: any): LogroLaboral => ({
        id_labor_achievement: Number(item.id),
        company: item.attributes?.empresa ?? "",
        position: item.attributes?.puesto ?? "",
        date: item.attributes?.fecha ?? "",
      }),
    );
  },
};
