import { apiClient, STORAGE_KEYS } from "../../../../core/api.config";
import type { AuthEgresadoResponse } from "../../domain/ActualizarEgresado";

export const EgresadoAuthService = {
  login: async (curp: string): Promise<AuthEgresadoResponse> => {
    const payload = {
      data: {
        type: "auth",
        attributes: {
          curp,
        },
      },
    };

    console.log("[EgresadoAuthService.login] Request payload", payload);

    const response = await apiClient.post<{
      data: {
        type: string;
        id: string;
        attributes: {
          nombre?: string;
          email?: string;
          mensaje?: string;
          primer_apellido?: string;
          segundo_apellido?: string;
          apellido_paterno?: string;
          apellido_materno?: string;
          fecha_nacimiento?: string;
        };
      };
      meta?: unknown;
    }>("/auth/login", payload);

    const data = response.data;
    console.log("[EgresadoAuthService.login] Raw response data", data);
    console.log("[EgresadoAuthService.login] Response headers", response.headers);

    const attrs = data.data.attributes ?? {};

    // Buscar el token en el body
    let accessToken =
      (data as any)?.meta?.accessToken ||
      (data as any)?.meta?.access_token ||
      (data as any)?.meta?.token ||
      (data as any)?.accessToken ||
      (data as any)?.access_token ||
      (data as any)?.token ||
      (data as any)?.data?.accessToken ||
      (data as any)?.data?.access_token ||
      (data as any)?.data?.token ||
      (attrs as any)?.accessToken ||
      (attrs as any)?.access_token ||
      (attrs as any)?.token ||
      (attrs as any)?.jwt;

    // Buscar el token en las headers de la respuesta
    if (!accessToken) {
      accessToken = 
        (response.headers as any)?.authorization?.replace('Bearer ', '') ||
        (response.headers as any)?.['x-access-token'] ||
        (response.headers as any)?.['x-token'] ||
        (response.headers as any)?.token;
    }

    const refreshToken =
      (data as any)?.meta?.refreshToken ||
      (data as any)?.meta?.refresh_token ||
      (data as any)?.refreshToken ||
      (data as any)?.refresh_token ||
      (data as any)?.data?.refreshToken ||
      (data as any)?.data?.refresh_token ||
      (attrs as any)?.refreshToken ||
      (attrs as any)?.refresh_token ||
      (response.headers as any)?.['x-refresh-token'];

    if (accessToken) {
      console.log("[EgresadoAuthService.login] Guardando accessToken en localStorage");
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    } else {
      console.warn("[EgresadoAuthService.login] No se encontró token JWT");
      console.warn("[EgresadoAuthService.login] Asumiendo que el servidor usa cookies de sesión");
      console.warn("[EgresadoAuthService.login] Data:", data);
      console.warn("[EgresadoAuthService-login] Headers de respuesta:", response.headers);
    }

    if (refreshToken) {
      console.log("[EgresadoAuthService.login] Guardando refreshToken en localStorage");
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_SCOPE, "egresado");
    localStorage.setItem(STORAGE_KEYS.EGRESADO_ID, data.data.id);

    // Si no hay token JWT, marcar que se autenticó por cookies
    if (!accessToken) {
      console.log("[EgresadoAuthService.login] Usando autenticación basada en cookies");
      localStorage.setItem("auth_method", "cookies");
    }

    // Verificar que el token se guardó
    const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log("[EgresadoAuthService.login] Token guardado en localStorage?", !!savedToken);
    if (savedToken) {
      console.log("[EgresadoAuthService.login] Primeros 30 caracteres del token:", savedToken.substring(0, 30));
    }

    return {
      id: data.data.id,
      nombre: attrs.nombre,
      apellidoPaterno: attrs.primer_apellido ?? attrs.apellido_paterno,
      apellidoMaterno: attrs.segundo_apellido ?? attrs.apellido_materno,
      fechaNacimiento: attrs.fecha_nacimiento,
      email: attrs.email,
      mensaje: attrs.mensaje,
    };
  },
};