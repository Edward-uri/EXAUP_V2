export interface Usuario {
    id_usuario: number;
    nombre: string;
    email: string;
    id_rol: number;
    rol_nombre: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RolUsuario {
    id_rol: number;
    nombre: string;
}

export interface FiltrosUsuarios {
    search?: string;
    id_rol?: number;
    is_active?: boolean;
}

export interface CrearUsuarioPayload {
    nombre: string;
    email: string;
    password: string;
    id_rol: number;
}

export interface ActualizarUsuarioPayload {
    nombre?: string;
    email?: string;
    id_rol?: number;
    is_active?: boolean;
}

// Nombre legible de cada rol para mostrarlo en pantalla.
export const ETIQUETA_ROL: Record<string, string> = {
    admin: 'Administrador',
    director_vinculacion: 'Dirección de Vinculación',
    director_programa_educativo: 'Dirección de Programa Educativo',
};