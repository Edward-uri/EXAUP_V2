import type { AuthEgresadoResponse } from "../domain/ActualizarEgresado";
import { EgresadoAuthService } from "./egresado/EgresadoAuthService";
import { EgresadoPerfilService } from "./egresado/EgresadoPerfilService";
import { EgresadoPerfilGetService } from "./egresado/EgresadoPerfilGetService";
import { DomicilioService } from "./domicilio/DomicilioService";
import { LaboralService } from "./laboral/LaboralService";
import { LogrosService } from "./logros/LogrosService";

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
};
