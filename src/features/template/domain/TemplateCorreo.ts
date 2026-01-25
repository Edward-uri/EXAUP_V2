export interface TemplateCorreo {
  id: string;
  type: 'templates-correo';
  attributes: {
    subject: string;
    body: string;       
    layout_html: string | null; 
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