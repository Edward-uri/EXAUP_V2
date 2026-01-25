export interface OpcionPregunta {
    id?: string;       
    texto: string;     
    etiqueta?: string; 
}

export interface Pregunta {
    id: string;             
    texto: string;          
    
    tipoId: string;         
    
    es_requerida: boolean;
    
    opciones?: OpcionPregunta[]; 
}