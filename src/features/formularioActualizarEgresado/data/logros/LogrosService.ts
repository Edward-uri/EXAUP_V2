import { apiClient } from "../../../../core/api.config";
import type { LogroAcademicoInput, LogroLaboralInput } from "../../domain/ActualizarEgresado";

interface LogroAcademicoAttributes {
  titulo: string;
  institucion: string;
  fecha: string;
}

interface LogroAcademicoResource {
  id: string;
  attributes: LogroAcademicoAttributes;
}

interface LogroLaboralAttributes {
  empresa: string;
  puesto: string;
  fecha: string;
}

interface LogroLaboralResource {
  id: string;
  attributes: LogroLaboralAttributes;
}

export const LogrosService = {
  createLogroAcademico: async (egresadoId: string, logro: LogroAcademicoInput): Promise<void> => {
    const payload = {
      data: {
        type: "logros-academicos",
        attributes: {
          titulo: logro.titulo,
          institucion: logro.institucion,
          fecha: logro.fecha,
        },
      },
    };

    await apiClient.post(`/egresado/${egresadoId}/logros-academicos`, payload);
  },

  createLogroLaboral: async (egresadoId: string, logro: LogroLaboralInput): Promise<void> => {
    const payload = {
      data: {
        type: "logros-laborales",
        attributes: {
          empresa: logro.empresa,
          puesto: logro.puesto,
          fecha: logro.fecha,
        },
      },
    };

    await apiClient.post(`/egresado/${egresadoId}/logros-laborales`, payload);
  },

  getLogrosAcademicos: async (egresadoId: string): Promise<LogroAcademicoResource[]> => {
    const { data } = await apiClient.get<{ data?: any }>(`/egresado/${egresadoId}/logros-academicos`);

    if (!data || !data.data) {
      return [];
    }

    const resources = Array.isArray(data.data) ? data.data : [];

    return resources.map((item: any) => ({
      id: String(item.id),
      attributes: {
        titulo: item.attributes?.titulo ?? "",
        institucion: item.attributes?.institucion ?? "",
        fecha: item.attributes?.fecha ?? "",
      },
    }));
  },

  getLogrosLaborales: async (egresadoId: string): Promise<LogroLaboralResource[]> => {
    const { data } = await apiClient.get<{ data?: any }>(`/egresado/${egresadoId}/logros-laborales`);

    if (!data || !data.data) {
      return [];
    }

    const resources = Array.isArray(data.data) ? data.data : [];

    return resources.map((item: any) => ({
      id: String(item.id),
      attributes: {
        empresa: item.attributes?.empresa ?? "",
        puesto: item.attributes?.puesto ?? "",
        fecha: item.attributes?.fecha ?? "",
      },
    }));
  },
};
