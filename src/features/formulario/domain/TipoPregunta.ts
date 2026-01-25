export interface TipoPregunta {
    id: string;      
    nombre: string;  
}

export interface TipoPreguntaListResponse {
    data: {
        type: string;
        id: string;
        attributes: {
            nombre: string;
        };
    }[];
}