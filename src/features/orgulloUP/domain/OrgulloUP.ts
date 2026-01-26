export interface Egresado {
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    email: string;
    programa_educativo: string;
}

export interface OrgulloUPRecord {
    type: 'orgullo_up';
    id: string;
    attributes: {
        status: 'activo' | 'inactivo' | 'pendiente';
        egresado: Egresado;
    };
}

export interface OrgulloUPMeta {
    total_records: number;
    page: number;
    limit: number;
}
