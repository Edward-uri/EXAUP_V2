export interface Egresado {
    id_egresado: number;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    matricula: string;
    curp: string;
    email: string;
    imagen_egresado: string;
    fecha_nacimiento: string;
    is_active: boolean;
    id_programa_educativo: number;
    programa_educativo: string;
    id_periodo: number;
}

export interface ProgramaEducativo {
    id_programa_educativo: number;
    nombre: string;
}

export interface FiltrosImportacion {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    prefijo_matricula?: string;
    busqueda?: string;
}
