import { apiClient } from '../../../core/api.config';
import type { Egresado, ProgramaEducativo, Cohorte, FiltrosImportacion } from '../domain/Egresado';

export const EgresadoService = {
    getProgramasEducativos: async (): Promise<ProgramaEducativo[]> => {
        const { data } = await apiClient.get('/egresado/programas-educativos');
        return data.data;
    },
    getCohortes: async (): Promise<Cohorte[]> => {
        const { data } = await apiClient.get('/egresado/cohortes');
        return data.data;
    },
    getEgresados: async (filtros: FiltrosImportacion, page = 1, limit = 20): Promise<{ data: Egresado[], meta: { total: number, page: number, limit: number } }> => {
        const params = new URLSearchParams();
        if (filtros.id_programa_educativo) params.append('id_programa_educativo', filtros.id_programa_educativo.toString());
        if (filtros.id_periodo_egreso) params.append('id_periodo_egreso', filtros.id_periodo_egreso.toString());
        if (filtros.cohorte) params.append('cohorte', filtros.cohorte.toString());
        if (filtros.prefijo_matricula) params.append('prefijo_matricula', filtros.prefijo_matricula);
        
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const { data } = await apiClient.get(`/egresados?${params.toString()}`);
        return data;
    }
};
