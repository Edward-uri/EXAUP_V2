import type { AuthEgresadoResponse } from "../domain/ActualizarEgresado";
import { EgresadoAuthService } from "./egresado/EgresadoAuthService";
import { EgresadoPerfilService } from "./egresado/EgresadoPerfilService";
import { EgresadoPerfilGetService } from "./egresado/EgresadoPerfilGetService";
import { DomicilioService } from "./domicilio/DomicilioService";
import { LaboralService } from "./laboral/LaboralService";
import { LogrosService } from "./logros/LogrosService";
import { apiClient } from "../../../core/api.config";

export const ActualizarEgresadoService = {
  login: async (curp: string): Promise<AuthEgresadoResponse> => {
    return EgresadoAuthService.login(curp);
  },

  getPerfilActual: (id: string) => EgresadoPerfilGetService.getPerfilActual(id),

  createDatosDomiciliarios: DomicilioService.createDatosDomiciliarios,
  getDatosDomiciliarios: DomicilioService.getDatosDomiciliarios,
  updateDatosDomiciliarios: DomicilioService.updateDatosDomiciliarios,

  createDatosLaborales: LaboralService.createDatosLaborales,
  getDatosLaborales: LaboralService.getDatosLaborales,
  updateDatosLaborales: LaboralService.updateDatosLaborales,

  updatePerfil: EgresadoPerfilService.updatePerfil,

  createLogroAcademico: LogrosService.createLogroAcademico,
  createLogroLaboral: LogrosService.createLogroLaboral,
  getLogrosAcademicos: LogrosService.getLogrosAcademicos,
  getLogrosLaborales: LogrosService.getLogrosLaborales,
  // Sube la imagen de Orgullo UP actualizando el perfil completo del egresado
  uploadOrgulloImage: (file: File, egresadoId: string) =>
    EgresadoPerfilService.updatePerfilConImagen(egresadoId, file),

  // Actualiza la sinopsis profesional del egresado
  updateSinopsis: async (egresadoId: string, sinopsis: string): Promise<void> => {
    const payload = {
      data: {
        type: "egresados",
        attributes: {
          sinopsis,
        },
      },
    };

    await apiClient.patch(`/egresado/${egresadoId}/sinopsis`, payload);
  },

  // Obtiene la sinopsis profesional del egresado (si existe)
  getSinopsis: async (egresadoId: string): Promise<string | null> => {
    try {
      const { data } = await apiClient.get<{
        data?: { attributes?: { sinopsis?: string | null } };
      }>(`/egresado/${egresadoId}/sinopsis`);

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
};
