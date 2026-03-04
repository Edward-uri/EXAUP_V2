import { apiClient, STORAGE_KEYS } from "../../../core/api.config";
import type { AuthUser } from "../domain/Login";

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
    }>("/auth/staff/login", payload);

    const accessToken =
      (data as any)?.meta?.accessToken ||
      (data as any)?.accessToken ||
      (data as any)?.access_token;

    const refreshToken =
      (data as any)?.meta?.refreshToken ||
      (data as any)?.refreshToken ||
      (data as any)?.refresh_token;

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }

    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    const attrs = (data as any)?.data?.attributes ?? {};

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
  },
};
