import { apiClient } from "../../../core/api.config";
import type { OrgulloUPRecord, OrgulloUPMeta } from "../domain/OrgulloUP";

export interface OrgulloUPListResponse {
    data: OrgulloUPRecord[];
    meta: OrgulloUPMeta;
}

interface OrgulloUPParams {
    page?: number;
    limit?: number;
    busqueda?: string;
}

export const OrgulloUPService = {
    // Usa el endpoint de participantes de una encuesta "Orgullo UP" (ajusta el ID según corresponda)
    getAll: async (page: number = 1, limit: number = 10): Promise<OrgulloUPListResponse> => {
        // Por ahora usa un endpoint genérico, tu backend debería tener uno específico o un ID de encuesta
        const { data } = await apiClient.get('/participantes', {
            params: {
                page,
                limit
            }
        });
        
        // Transforma la respuesta de participantes al formato de OrgulloUP
        return {
            data: data.data.map((p: any) => ({
                type: 'orgullo_up',
                id: p.id,
                attributes: {
                    status: p.attributes.is_active ? 'activo' : 'inactivo',
                    egresado: {
                        nombre: p.attributes.egresado.nombre,
                        primer_apellido: p.attributes.egresado.primer_apellido,
                        segundo_apellido: p.attributes.egresado.segundo_apellido,
                        email: p.attributes.egresado.email,
                        programa_educativo: p.attributes.egresado.programa_educativo || ''
                    }
                }
            })),
            meta: data.meta
        };
    },

    getById: async (id: string): Promise<OrgulloUPRecord> => {
        const { data } = await apiClient.get(`/participantes/${id}`);
        
        return {
            type: 'orgullo_up',
            id: data.data.id,
            attributes: {
                status: data.data.attributes.is_active ? 'activo' : 'inactivo',
                egresado: {
                    nombre: data.data.attributes.egresado.nombre,
                    primer_apellido: data.data.attributes.egresado.primer_apellido,
                    segundo_apellido: data.data.attributes.egresado.segundo_apellido,
                    email: data.data.attributes.egresado.email,
                    programa_educativo: data.data.attributes.egresado.programa_educativo || ''
                }
            }
        };
    },

    create: async (egresadoData: any): Promise<OrgulloUPRecord> => {
        const payload = {
            data: {
                type: 'participante',
                attributes: egresadoData
            }
        };
        const { data } = await apiClient.post('/participantes', payload);
        
        return {
            type: 'orgullo_up',
            id: data.data.id,
            attributes: {
                status: data.data.attributes.is_active ? 'activo' : 'inactivo',
                egresado: {
                    nombre: data.data.attributes.egresado.nombre,
                    primer_apellido: data.data.attributes.egresado.primer_apellido,
                    segundo_apellido: data.data.attributes.egresado.segundo_apellido,
                    email: data.data.attributes.egresado.email,
                    programa_educativo: data.data.attributes.egresado.programa_educativo || ''
                }
            }
        };
    },

    update: async (id: string, egresadoData: any): Promise<OrgulloUPRecord> => {
        const payload = {
            data: {
                type: 'participante',
                attributes: egresadoData
            }
        };
        const { data } = await apiClient.patch(`/participantes/${id}`, payload);
        
        return {
            type: 'orgullo_up',
            id: data.data.id,
            attributes: {
                status: data.data.attributes.is_active ? 'activo' : 'inactivo',
                egresado: {
                    nombre: data.data.attributes.egresado.nombre,
                    primer_apellido: data.data.attributes.egresado.primer_apellido,
                    segundo_apellido: data.data.attributes.egresado.segundo_apellido,
                    email: data.data.attributes.egresado.email,
                    programa_educativo: data.data.attributes.egresado.programa_educativo || ''
                }
            }
        };
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/participantes/${id}`);
    }
};
