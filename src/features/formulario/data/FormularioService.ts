import { apiClient } from "../../../core/api.config";
import type { Formulario, CreateFormularioRequest } from "../domain/Formulario";

const ENDPOINT = "/formulario"; 

export interface PreguntaDetalle {
  type: 'preguntas';
  id: string;
  attributes: {
    texto_pregunta: string;
    es_obligatoria: number;
    orden_en_formulario: number;
  };
  relationships: {
    tipo_pregunta: {
      data: {
        id: string;
        nombre: string;
      };
    };
    opciones: Array<{
      id: string;
      texto: string;
      etiqueta: string;
    }>;
  };
}

export const FormularioService = {

  create: async (titulo: string, descripcion: string): Promise<Formulario> => {
    const payload: CreateFormularioRequest = {
      data: {
        type: 'formularios',
        attributes: {
          titulo,
          descripcion,
          is_active: true 
        }
      }
    };
    const { data } = await apiClient.post<{ data: Formulario }>(ENDPOINT, payload);
    return data.data;
  },

  getAll: async (): Promise<Formulario[]> => {
    const { data } = await apiClient.get<any>(ENDPOINT);
    
    if (!Array.isArray(data.data)) return [];

    const formulariosLimpios = data.data.map((item: any) => {
        if (item.data && item.data.attributes) {
            return item.data;
        }
        if (item.attributes) {
            return item;
        }
        return null;
    });

    return formulariosLimpios.filter(Boolean);
  },

  getById: async (id: string): Promise<Formulario> => {
    const { data } = await apiClient.get<{ data: Formulario }>(`${ENDPOINT}/${id}`);
    return data.data;
  },

  update: async (id: string, attrs: Partial<{ titulo: string; descripcion: string; is_active: boolean }>): Promise<Formulario> => {
    const payload = {
      data: {
        type: 'formularios',
        attributes: attrs
      }
    };
    const { data } = await apiClient.patch<{ data: Formulario }>(`${ENDPOINT}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  getPreguntas: async (id: string): Promise<PreguntaDetalle[]> => {
    const { data } = await apiClient.get<{ data: PreguntaDetalle[] }>(`${ENDPOINT}/${id}/preguntas`);
    return data.data;
  },

  getPreguntaCount: async (preguntaId: string): Promise<number> => {
    const { data } = await apiClient.get<{ meta: { formularios_count: number } }>(`${ENDPOINT}/pregunta/${preguntaId}/count`);
    return data.meta.formularios_count;
  },

  removePregunta: async (formularioId: string, preguntaId: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${formularioId}/preguntas/${preguntaId}`);
  },

  toggleActive: async (id: string, isActive: boolean): Promise<Formulario> => {
    return FormularioService.update(id, { is_active: isActive });
  }
};