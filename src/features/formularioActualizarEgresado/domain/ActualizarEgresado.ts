export interface AuthEgresadoResponse {
  id: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  email?: string;
  mensaje?: string;
}

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

export interface LogroAcademicoInput {
  titulo: string;
  institucion: string;
  fecha: string;
}

export interface LogroAcademicoResource {
  id: string;
  attributes: LogroAcademicoInput;
}

export interface LogroLaboralInput {
  empresa: string;
  puesto: string;
  fecha: string;
}

export interface LogroLaboralResource {
  id: string;
  attributes: LogroLaboralInput;
}

export interface UploadFileAttributes {
  url?: string;
  location?: string;
  path?: string;
}

export interface UploadFileData extends UploadFileAttributes {
  id?: string | number;
  type?: string;
  attributes?: UploadFileAttributes;
}

export interface UploadFileResponse {
  data?: UploadFileData | UploadFileData[];
  url?: string;
  location?: string;
  path?: string;
}
