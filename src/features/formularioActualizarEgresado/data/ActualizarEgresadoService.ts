import { apiClient } from "../../../core/api.config";
import type {
  AuthEgresadoResponse,
  LogroAcademicoInput,
  LogroLaboralInput
} from "../domain/ActualizarEgresado";

export const ActualizarEgresadoService = {
  login: async (matricula: string, curp: string): Promise<AuthEgresadoResponse> => {
    const payload = {
      data: {
        type: "auth",
        attributes: {
          matricula,
          curp
        }
      }
    };

    const { data } = await apiClient.post<{
      data: {
        type: string;
        id: string;
        attributes: {
          nombre?: string;
          email?: string;
          mensaje?: string;
        };
      };
    }>("/auth/login", payload);

    return {
      id: data.data.id,
      nombre: data.data.attributes?.nombre,
      email: data.data.attributes?.email,
      mensaje: data.data.attributes?.mensaje
    };
  },

  createLogroAcademico: async (egresadoId: string, logro: LogroAcademicoInput): Promise<void> => {
    const payload = {
      data: {
        type: "logros-academicos",
        attributes: {
          titulo: logro.titulo,
          institucion: logro.institucion,
          fecha: logro.fecha
        }
      }
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
          fecha: logro.fecha
        }
      }
    };

    await apiClient.post(`/egresado/${egresadoId}/logros-laborales`, payload);
  }
};
