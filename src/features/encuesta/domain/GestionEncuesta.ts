export interface Grupo {
    type: 'grupos';
    id: string;
    attributes: {
        name: string;
        descripcion: string;
    };
}

export interface Participante {
    type: 'participante';
    id: string; 
    attributes: {
        is_active: boolean;
        estado_respuesta: 'pendiente' | 'contestada';
        fecha_respuesta?: string;
        egresado: {
            nombre: string;
            primer_apellido: string;
            segundo_apellido: string;
            matricula: string;
            email: string;
        };
    };
}

export interface AsignacionResponse {
    meta: {
        created: number;
        reactivated: number;
        skipped: number;
    };
}

export interface DispatchResponse {
    data: {
        survey_id: number;
        target_filter: string;
        total_participants: number;
        batches_processed: number;
        message: string;
    };
}

export interface ParticipantesMeta {
    total_records: number;
    page: number;
    limit: number;
}
