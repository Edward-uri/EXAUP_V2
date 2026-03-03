export interface Egresado {
    id_egresado?: number;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string | null;
    matricula: string;
    curp: string;
    email: string | null;
    imagen_egresado: string | null;
    fecha_nacimiento: string | null;
    is_active: boolean;
    id_programa_educativo: number | null;
    programa_educativo?: string | null;
    id_periodo: number | null;
}

export interface PerfilActualizable {
    nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string | null;
    curp?: string;
    email?: string | null;
    imagen_egresado?: string | null;
    fecha_nacimiento?: string | null;
    id_programa_educativo?: number | null;
}

export interface LogroAcademico {
    id_academic_achievement: number;
    name: string;
    institution: string;
    date: string;
}

export interface LogroLaboral {
    id_labor_achievement: number;
    company: string;
    position: string;
    date: string;
}

export interface OrgulloUPRecord {
    type: 'orgullo_up';
    id: string;
    attributes: {
        status: 'pendiente' | 'rechazado' | 'aprobado';
        egresado: Egresado;
        logros_academicos?: LogroAcademico[];
        logros_laborales?: LogroLaboral[];
    };
}

export interface OrgulloUPMeta {
    total_records: number;
    page: number;
    limit: number;
}
