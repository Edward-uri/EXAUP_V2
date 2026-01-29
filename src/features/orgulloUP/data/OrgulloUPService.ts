import { apiClient } from "../../../core/api.config";
import type { OrgulloUPRecord, OrgulloUPMeta } from "../domain/OrgulloUP";

const ENDPOINT = "/egresado/perfiles-completos";

export interface OrgulloUPListResponse {
    data: OrgulloUPRecord[];
    meta: OrgulloUPMeta;
}

interface ApiResponse {
    success: boolean;
    data: Array<{
        egresado: {
            id: number;
            nombre: string;
            primer_apellido: string;
            segundo_apellido: string | null;
            matricula: string;
            curp: string;
            email: string | null;
            imagen_egresado: string | null;
            fecha_nacimiento: string | null;
            is_active: boolean;
            id_programa_educativo: number | null;
            id_periodo: number | null;
        };
        logros_academicos?: any[];
        logros_laborales?: any[];
    }>;
    total: number;
}

interface OrgulloUPParams {
    page?: number;
    limit?: number;
    busqueda?: string;
}

export const OrgulloUPService = {
    // Obtiene los perfiles completos de egresados
    getAll: async (page: number = 1, limit: number = 10): Promise<OrgulloUPListResponse> => {
        const { data } = await apiClient.get<ApiResponse>(ENDPOINT, {
            params: {
                page,
                limit
            }
        });
        
        // Transforma la respuesta al formato de OrgulloUP
        return {
            data: data.data.map((item) => {
                const egresado = item.egresado;
                
                return {
                    type: 'orgullo_up',
                    id: String(egresado.id),
                    attributes: {
                        status: egresado.is_active ? 'activo' : 'inactivo',
                        egresado: {
                            id_egresado: egresado.id,
                            nombre: egresado.nombre,
                            primer_apellido: egresado.primer_apellido,
                            segundo_apellido: egresado.segundo_apellido,
                            matricula: egresado.matricula,
                            curp: egresado.curp,
                            email: egresado.email,
                            imagen_egresado: egresado.imagen_egresado,
                            fecha_nacimiento: egresado.fecha_nacimiento,
                            is_active: egresado.is_active,
                            id_programa_educativo: egresado.id_programa_educativo,
                            id_periodo: egresado.id_periodo
                        },
                        logros_academicos: item.logros_academicos || [],
                        logros_laborales: item.logros_laborales || []
                    }
                };
            }),
            meta: {
                total_records: data.total,
                page,
                limit
            }
        };
    },

    getById: async (id: string): Promise<OrgulloUPRecord> => {
        const { data } = await apiClient.get<ApiResponse>(`${ENDPOINT}/${id}`, {
            params: {
                limit: 1
            }
        });
        
        if (!data.data || data.data.length === 0) {
            throw new Error('Egresado no encontrado');
        }
        
        const egresado = data.data[0].egresado;
        const item = data.data[0];
        
        return {
            type: 'orgullo_up',
            id: String(egresado.id),
            attributes: {
                status: egresado.is_active ? 'activo' : 'inactivo',
                egresado: {
                    id_egresado: egresado.id,
                    nombre: egresado.nombre,
                    primer_apellido: egresado.primer_apellido,
                    segundo_apellido: egresado.segundo_apellido,
                    matricula: egresado.matricula,
                    curp: egresado.curp,
                    email: egresado.email,
                    imagen_egresado: egresado.imagen_egresado,
                    fecha_nacimiento: egresado.fecha_nacimiento,
                    is_active: egresado.is_active,
                    id_programa_educativo: egresado.id_programa_educativo,
                    id_periodo: egresado.id_periodo
                },
                logros_academicos: item.logros_academicos || [],
                logros_laborales: item.logros_laborales || []
            }
        };
    },

    create: async (egresadoData: any): Promise<OrgulloUPRecord> => {
        // No se usa el servicio de OrgulloUP para crear - se usa formularioActualizarEgresado
        throw new Error('Operación no disponible para Orgullo UP');
    },

    update: async (id: string, egresadoData: any): Promise<OrgulloUPRecord> => {
        // No se usa el servicio de OrgulloUP para actualizar - se usa formularioActualizarEgresado
        throw new Error('Operación no disponible para Orgullo UP');
    },

    delete: async (id: string): Promise<void> => {
        // No se usa el servicio de OrgulloUP para eliminar
        throw new Error('Operación no disponible para Orgullo UP');
    }
};
