import { apiClient, getAuthHeaders } from '../../../core/api.config';
import type { Grupo, CrearGrupoPayload, MiembroGrupo } from '../domain/Grupo';
import type { FiltrosImportacion } from '../domain/Egresado';

export const GrupoService = {
    getAll: async (): Promise<Grupo[]> => {
        const { data } = await apiClient.get('/grupo', { headers: getAuthHeaders() });
        return data.data;
    },
    getById: async (id: string): Promise<Grupo> => {
        const { data } = await apiClient.get(`/grupo/${id}`, { headers: getAuthHeaders() });
        return data.data;
    },
    create: async (payload: CrearGrupoPayload): Promise<Grupo> => {
        const { data } = await apiClient.post('/grupo', payload, { headers: getAuthHeaders() });
        return data.data;
    },
    update: async (id: string, payload: CrearGrupoPayload): Promise<Grupo> => {
        const { data } = await apiClient.patch(`/grupo/${id}`, payload, { headers: getAuthHeaders() });
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/grupo/${id}`, { headers: getAuthHeaders() });
    },
    importMembers: async (id: string, filtros: FiltrosImportacion): Promise<any> => {
        const payload = {
            data: {
                type: 'importacion-masiva',
                attributes: {
                    filtros
                }
            }
        };
        const { data } = await apiClient.post(`/grupos/${id}/miembros/importar`, payload, { headers: getAuthHeaders() });
        return data.data;
    },
    getMembers: async (id: string): Promise<MiembroGrupo[]> => {
        const { data } = await apiClient.get(`/grupo/${id}/members`, { headers: getAuthHeaders() });
        const members: MiembroGrupo[] = data.data;

        // Enriquecer los miembros con la información del egresado
        const enrichedMembers = await Promise.all(
            members.map(async (m) => {
                try {
                    // Intentamos obtener el perfil completo del egresado
                    // En caso de que no haya ruta de admin, probamos ambas posibles
                    let perfilData;
                    try {
                        const res = await apiClient.get(`/egresado/admin/${m.attributes.id_egresado}/perfil-completo`, { headers: getAuthHeaders() });
                        perfilData = res.data;
                    } catch {
                        const res = await apiClient.get(`/egresado/${m.attributes.id_egresado}/perfil-completo`, { headers: getAuthHeaders() });
                        perfilData = res.data;
                    }
                    
                    const eg = perfilData?.data?.egresado || perfilData?.data;
                    
                    if (eg) {
                        m.attributes.egresado = {
                            nombre: eg.nombre || 'Egresado',
                            primer_apellido: eg.primer_apellido || '',
                            segundo_apellido: eg.segundo_apellido || '',
                            matricula: eg.matricula || '',
                            email: eg.email || ''
                        };
                    } else {
                        // Fallback si no hay data
                        m.attributes.egresado = {
                            nombre: 'Egresado',
                            primer_apellido: 'Sin detalles',
                            segundo_apellido: '',
                            matricula: '',
                            email: `ID: ${m.attributes.id_egresado}`
                        };
                    }
                } catch (e) {
                    console.error(`Error al obtener detalles del egresado ${m.attributes.id_egresado}`);
                    m.attributes.egresado = {
                        nombre: 'Egresado',
                        primer_apellido: 'Desconocido',
                        segundo_apellido: '',
                        matricula: '',
                        email: `ID: ${m.attributes.id_egresado}`
                    };
                }
                return m;
            })
        );

        return enrichedMembers;
    },
    removeMember: async (id: string, idEgresado: string): Promise<void> => {
        await apiClient.delete(`/grupo/${id}/members/${idEgresado}`, { headers: getAuthHeaders() });
    }
};
