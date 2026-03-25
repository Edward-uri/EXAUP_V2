import { apiClient, STORAGE_KEYS } from "../../../core/api.config";
import type { AuthUser } from "../domain/Login";

function pickToken(...candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return null;
}

export const LoginService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const payload = {
      data: {
        type: "auth-staff",
        attributes: {
          email,
          password,
        },
      },
    };

    const { data } = await apiClient.post<{
      data: {
        id: string;
        type: string;
        attributes: Record<string, any>;
      };
      meta?: Record<string, any>;
      accessToken?: string;
      refreshToken?: string;
      access_token?: string;
      refresh_token?: string;
      token?: string;
    }>("/auth/staff/login", payload);

    const attrs = (data as any)?.data?.attributes ?? {};

    const accessToken = pickToken(
      (data as any)?.meta?.accessToken,
      (data as any)?.meta?.access_token,
      (data as any)?.meta?.token,
      (data as any)?.accessToken,
      (data as any)?.access_token,
      (data as any)?.token,
      (data as any)?.data?.accessToken,
      (data as any)?.data?.access_token,
      (data as any)?.data?.token,
      attrs?.accessToken,
      attrs?.access_token,
      attrs?.token,
      attrs?.jwt
    );

    const refreshToken = pickToken(
      (data as any)?.meta?.refreshToken,
      (data as any)?.meta?.refresh_token,
      (data as any)?.refreshToken,
      (data as any)?.refresh_token,
      (data as any)?.data?.refreshToken,
      (data as any)?.data?.refresh_token,
      attrs?.refreshToken,
      attrs?.refresh_token
    );

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }

    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_SCOPE, "staff");
    localStorage.removeItem(STORAGE_KEYS.EGRESADO_ID);

    const user: AuthUser = {
      id: (data as any)?.data?.id,
      nombre:
        attrs.nombre ||
        attrs.name ||
        [attrs.primer_apellido, attrs.segundo_apellido]
          .filter(Boolean)
          .join(" ") ||
        undefined,
      email: attrs.email || email,
      roles: attrs.rol
        ? [String(attrs.rol)]
        : Array.isArray(attrs.roles)
        ? attrs.roles
        : attrs.roles
        ? [attrs.roles]
        : undefined,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRED);
    } catch {
    }

    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRED);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SCOPE);
    localStorage.removeItem(STORAGE_KEYS.EGRESADO_ID);
  },
};
