import { ALL_ROLES, USER_ROLES, type UserRole } from "./Roles";

const { ADMIN, DIRECTOR_VINCULACION } = USER_ROLES;

// Qué roles pueden usar cada funcionalidad (según la matriz del profe).
export const PERMISOS = {
    inicio: ALL_ROLES,
    encuestas: ALL_ROLES,
    formularios: ALL_ROLES,
    grupos: ALL_ROLES,
    eventosAutomaticos: ALL_ROLES,
    orgulloUp: ALL_ROLES,
    usuarios: [ADMIN, DIRECTOR_VINCULACION],
} satisfies Record<string, UserRole[]>;

export type Funcionalidad = keyof typeof PERMISOS;

export function puedeUsar(
    roles: string[] | null | undefined,
    funcionalidad: Funcionalidad
): boolean {
    if (!roles || roles.length === 0) return false;
    return PERMISOS[funcionalidad].some((rol) => roles.includes(rol));
}