import { apiClient } from "../../../core/api.config";

export interface PublicQuestionOption {
  id?: string;
  texto?: string;
  etiqueta?: string;
  valor?: string;
}

export interface PublicQuestion {
  id: string;
  tipo: string;
  texto: string;
  es_obligatoria: boolean;
  orden: number;
  opciones?: PublicQuestionOption[];
}

export interface PublicSurvey {
  titulo_encuesta: string;
  descripcion?: string;
  formulario: {
    titulo: string;
    preguntas: PublicQuestion[];
  };
}

export interface SubmitSurveyResponse {
  data: {
    id_respuesta: number;
    mensaje: string;
  };
}

export const PublicSurveyService = {
  getByUuid: async (uuid: string): Promise<PublicSurvey> => {
    const { data } = await apiClient.get(`/encuestas/responder/${uuid}`);
    return data;
  },
  submit: async (
    uuid: string,
    respuestas: Record<string, string>
  ): Promise<SubmitSurveyResponse> => {
    const payload = { respuestas_json: respuestas };
    const { data } = await apiClient.post(`/encuestas/responder/${uuid}`, payload);
    return data;
  }
};
