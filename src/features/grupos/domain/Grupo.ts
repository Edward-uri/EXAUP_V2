export interface Grupo {
    type: 'grupos';
    id: string;
    attributes: {
        nombre?: string;
        name?: string;
        descripcion?: string;
    };
}

export interface CrearGrupoPayload {
    data: {
        type: 'grupos';
        attributes: {
            nombre: string;
            descripcion: string;
        };
    };
}

export interface MiembroGrupo {
    type: 'miembros-grupo';
    id: string;
    attributes: {
        id_grupo: number;
        id_egresado: number;
        egresado?: {
            nombre: string;
            primer_apellido: string;
            segundo_apellido: string;
            matricula: string;
            email: string;
        };
    };
}
