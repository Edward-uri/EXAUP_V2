export interface Formulario {
  id: string;
  type: 'formularios';
  attributes: {
    titulo: string;
    descripcion: string;
    is_active: boolean;
    fecha_creacion?: string;
  };
  relationships?: {
    preguntas?: {
      data: { type: 'pregunta'; id: string; attributes?: { orden: number } }[];
    };
  };
}

export interface CreateFormularioRequest {
  data: {
    type: 'formularios';
    attributes: {
      titulo: string;
      descripcion: string;
      is_active: boolean;
    }
  }
}

export interface FormularioListResponse {
  data: {
    data: Formulario; 
  }[];
}