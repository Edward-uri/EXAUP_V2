import { STORAGE_KEYS } from "./api.config";

export type KnownInternalRole =
  | "super_admin"
  | "director_vinculacion"
  | "director_programa_educativo";

const INTERNAL_ROLES: KnownInternalRole[] = [
  "super_admin",
  "director_vinculacion",
  "director_programa_educativo",
];

function safeGetLocalStorage(key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getStoredUserRoles(): string[] {
  const user = safeParseJson<{ roles?: unknown }>(safeGetLocalStorage(STORAGE_KEYS.USER));
  if (!user || !Array.isArray(user.roles)) return [];
  return user.roles.filter((r): r is string => typeof r === "string");
}

export function hasInternalRole(): boolean {
  const roles = getStoredUserRoles();
  return roles.some((role) => INTERNAL_ROLES.includes(role as KnownInternalRole));
}

export function getAuthScope(): "staff" | "egresado" | null {
  const scope = safeGetLocalStorage(STORAGE_KEYS.AUTH_SCOPE);
  if (scope === "staff" || scope === "egresado") {
    return scope;
  }
  return null;
}

export function getSessionEgresadoId(): string | null {
  const raw = safeGetLocalStorage(STORAGE_KEYS.EGRESADO_ID);
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveEgresadoPerfilUpdateId(requestedId: string): string {
  const authScope = getAuthScope();
  const sessionId = getSessionEgresadoId();

  // En sesión de egresado forzamos a usar el id autenticado para evitar 401/403 por mismatch.
  if (authScope === "egresado" && sessionId) {
    if (requestedId !== sessionId) {
      console.warn(
        "[AuthContext] ID de egresado ajustado al id de sesión",
        { requestedId, sessionId },
      );
    }
    return sessionId;
  }

  return requestedId;
}
