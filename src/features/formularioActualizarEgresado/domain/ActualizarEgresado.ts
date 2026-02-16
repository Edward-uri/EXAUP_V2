export interface AuthEgresadoResponse {
  id: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  email?: string;
  mensaje?: string;
}

export interface LogroAcademicoInput {
  titulo: string;
  institucion: string;
  fecha: string;
}

export interface LogroLaboralInput {
  empresa: string;
  puesto: string;
  fecha: string;
}
