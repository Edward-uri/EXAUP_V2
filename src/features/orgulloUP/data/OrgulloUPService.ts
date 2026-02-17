import { apiClient } from "../../../core/api.config";
import type { OrgulloUPRecord, OrgulloUPMeta, PerfilActualizable } from "../domain/OrgulloUP";

const normalizeImageUrl = (url?: string | null): string | null | undefined => {
    if (!url) return url ?? null;
    return url.replace("/uploads/uploads/", "/uploads/");
};

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
            id_estado?: number; // 1: Pendiente, 2: Rechazado, 3: Aprobado
            id_programa_educativo: number | null;
            id_periodo: number | null;
        };
        logros_academicos?: any[];
        logros_laborales?: any[];
    }>;
    total: number;
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
                
                // Mapear estado: 1: Pendiente, 2: Rechazado, 3: Aprobado
                // NOTA: El API GET devuelve is_active pero no id_estado
                const mapEstado = (id_estado?: number, is_active?: boolean | number): 'pendiente' | 'rechazado' | 'aprobado' => {
                    // Si tenemos id_estado, usarlo directamente
                    if (id_estado !== undefined && id_estado !== null) {
                        switch (id_estado) {
                            case 1: return 'pendiente';
                            case 2: return 'rechazado';
                            case 3: return 'aprobado';
                            default: return 'pendiente';
                        }
                    }
                    
                    // Fallback a is_active si id_estado no está disponible
                    if (is_active !== undefined && is_active !== null) {
                        // Convertir boolean a número si es necesario
                        const isActiveNum = typeof is_active === 'boolean' ? (is_active ? 1 : 0) : is_active;
                        return isActiveNum === 1 ? 'aprobado' : 'rechazado';
                    }
                    
                    return 'pendiente';
                };
                
                const status = mapEstado(egresado.id_estado, egresado.is_active);
                return {
                    type: 'orgullo_up',
                    id: String(egresado.id),
                    attributes: {
                        status: status,
                        egresado: {
                            id_egresado: egresado.id,
                            nombre: egresado.nombre,
                            primer_apellido: egresado.primer_apellido,
                            segundo_apellido: egresado.segundo_apellido,
                            matricula: egresado.matricula,
                            curp: egresado.curp,
                            email: egresado.email,
                            imagen_egresado: normalizeImageUrl(egresado.imagen_egresado) ?? null,
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
        
        const mapEstado = (id_estado?: number, is_active?: boolean | number): 'pendiente' | 'rechazado' | 'aprobado' => {
            // Si tenemos id_estado, usarlo directamente
            if (id_estado !== undefined && id_estado !== null) {
                switch (id_estado) {
                    case 1: return 'pendiente';
                    case 2: return 'rechazado';
                    case 3: return 'aprobado';
                    default: return 'pendiente';
                }
            }
            
            // Fallback a is_active si id_estado no está disponible
            if (is_active !== undefined && is_active !== null) {
                // Convertir boolean a número si es necesario
                const isActiveNum = typeof is_active === 'boolean' ? (is_active ? 1 : 0) : is_active;
                return isActiveNum === 1 ? 'aprobado' : 'rechazado';
            }
            
            return 'pendiente';
        };
        
        const status = mapEstado(egresado.id_estado, egresado.is_active);
        return {
            type: 'orgullo_up',
            id: String(egresado.id),
            attributes: {
                status: status,
                egresado: {
                    id_egresado: egresado.id,
                    nombre: egresado.nombre,
                    primer_apellido: egresado.primer_apellido,
                    segundo_apellido: egresado.segundo_apellido,
                    matricula: egresado.matricula,
                    curp: egresado.curp,
                    email: egresado.email,
                    imagen_egresado: normalizeImageUrl(egresado.imagen_egresado) ?? null,
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

    create: async (_egresadoData: any): Promise<OrgulloUPRecord> => {
        // No se usa el servicio de OrgulloUP para crear - se usa formularioActualizarEgresado
        throw new Error('Operación no disponible para Orgullo UP');
    },

    update: async (_id: string, _egresadoData: any): Promise<OrgulloUPRecord> => {
        // No se usa el servicio de OrgulloUP para actualizar - se usa formularioActualizarEgresado
        throw new Error('Operación no disponible para Orgullo UP');
    },

    delete: async (_id: string): Promise<void> => {
        // No se usa el servicio de OrgulloUP para eliminar
        throw new Error('Operación no disponible para Orgullo UP');
    },

    // Actualiza el estado del egresado (1: Pendiente, 2: Rechazado, 3: Aprobado)
    updateEstado: async (id: string, estado: 1 | 2 | 3): Promise<void> => {
        const payload = {
            data: {
                type: 'egresados',
                id: id,
                attributes: {
                    id_estado: estado
                }
            }
        };
        await apiClient.patch(`/egresado/${id}/estado`, payload);
    },

    // Actualiza los datos de perfil del egresado (no incluye matrícula ni periodo)
    updatePerfil: async (id: string, perfilData: PerfilActualizable): Promise<void> => {
        const payload = {
            data: {
                type: 'egresados',
                id: id,
                attributes: perfilData
            }
        };
        await apiClient.patch(`/egresado/${id}/perfil`, payload);
    }
};
