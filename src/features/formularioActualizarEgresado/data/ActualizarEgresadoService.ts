import { apiClient } from "../../../core/api.config";
import type {
  AuthEgresadoResponse,
  LogroAcademicoInput,
  LogroLaboralInput
} from "../domain/ActualizarEgresado";

export const ActualizarEgresadoService = {
  login: async (curp: string): Promise<AuthEgresadoResponse> => {
    const payload = {
      data: {
        type: "auth",
        attributes: {
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

  createDatosDomiciliarios: async (data: {
    calle: string;
    colonia: string;
    numero_exterior: string;
    codigo_postal: string;
    estado: string;
    ciudad: string;
  }): Promise<void> => {
    const payload = {
      data: {
        type: "datos-domiciliarios",
        attributes: data
      }
    };

    await apiClient.post("/datos-domiciliarios", payload);
  },

  createDatosLaborales: async (data: {
    trabaja_actualmente: boolean;
    nombre_empresa: string;
    puesto: string;
    id_sector: number | null;
    actividad_principal: string;
  }): Promise<void> => {
    const payload = {
      data: {
        type: "datos-laborales",
        attributes: data
      }
    };

    await apiClient.post("/datos-laborales", payload);
  },

  updatePerfil: async (id: string, data: {
    email?: string;
    fecha_nacimiento?: string;
    imagen_egresado?: string | null;
  }): Promise<void> => {
    const payload = {
      data: {
        type: "egresados",
        id,
        attributes: data
      }
    };

    await apiClient.patch(`/egresado/${id}/perfil`, payload);
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
