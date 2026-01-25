export interface TemplateCorreo {
  id: string;
  type: 'templates-correo';
  attributes: {
    subject: string;
    body: string;
  };
  relationships?: {
    tipo_correo?: {
      data: { type: 'tipo_correo'; id: number };
    };
  };
}

export interface TemplateListResponse {
  data: TemplateCorreo[];
}