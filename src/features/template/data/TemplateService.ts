import { apiClient } from "../../../core/api.config"; 
import type { TemplateCorreo, TemplateListResponse } from "../domain/TemplateCorreo";

const ENDPOINT = "/templates-correo"; 

export const TemplateService = {
  getAll: async (): Promise<TemplateCorreo[]> => {
    const { data } = await apiClient.get<TemplateListResponse>(ENDPOINT);
    return data.data;
  },

  getById: async (id: string): Promise<TemplateCorreo> => {
    const { data } = await apiClient.get<{ data: TemplateCorreo }>(`${ENDPOINT}/${id}`);
    return data.data; 
  },

  update: async (id: string, templateData: { subject: string; body: string; layout_html?: string; tipoCorreoId?: string }): Promise<TemplateCorreo> => {
    let tipoCorreoId: string | number | undefined = templateData.tipoCorreoId;
    if (!tipoCorreoId) {
      const currentTemplate = await TemplateService.getById(id);
      tipoCorreoId = currentTemplate.relationships?.tipo_correo?.data?.id;
    }

    const payload = {
      data: {
        type: "templates-correo",
        attributes: {
          asunto: templateData.subject,
          cuerpo: templateData.body,
          layout_html: templateData.layout_html || null
        },
        relationships: tipoCorreoId ? {
          tipo_correo: {
            data: {
              type: "tipo_correo",
              id: String(tipoCorreoId)
            }
          }
        } : undefined
      }
    };
    const { data } = await apiClient.put<{ data: TemplateCorreo }>(`${ENDPOINT}/${id}`, payload);
    return data.data;
  }
};