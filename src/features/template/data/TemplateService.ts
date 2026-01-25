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
  }
};