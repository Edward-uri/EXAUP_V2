import { apiClient } from '../../../core/api.config';
import type {
    ActualizarUsuarioPayload,
    CrearUsuarioPayload,
    FiltrosUsuarios,
    RolUsuario,
    Usuario,
} from '../domain/Usuario';

const BASE = '/admin/usuarios-internos';

// El back responde { success: false, error: '...' } cuando algo no se permite.
export function mensajeDeError(err: unknown, porDefecto: string): string {
    const e = err as { response?: { data?: { error?: string } } };
    return e?.response?.data?.error || porDefecto;
}

export const UsuarioService = {
    getAll: async (filtros: FiltrosUsuarios = {}): Promise<Usuario[]> => {
        const { data } = await apiClient.get(BASE, { params: filtros });
        return data.data;
    },
    getRoles: async (): Promise<RolUsuario[]> => {
        const { data } = await apiClient.get(`${BASE}/roles`);
        return data.data;
    },
    create: async (payload: CrearUsuarioPayload): Promise<Usuario> => {
        const { data } = await apiClient.post(BASE, payload);
        return data.data;
    },
    update: async (id: number, payload: ActualizarUsuarioPayload): Promise<Usuario> => {
        const { data } = await apiClient.patch(`${BASE}/${id}`, payload);
        return data.data;
    },
    resetPassword: async (id: number, newPassword: string): Promise<void> => {
        await apiClient.patch(`${BASE}/${id}/reset-password`, { new_password: newPassword });
    },
    deactivate: async (id: number): Promise<void> => {
        await apiClient.patch(`${BASE}/${id}/deactivate`);
    },
};