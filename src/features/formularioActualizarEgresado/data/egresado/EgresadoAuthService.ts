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

    const { data } = await apiClient.post<{
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

    console.log("[EgresadoAuthService.login] Raw response", data);

    const attrs = data.data.attributes ?? {};

    const accessToken =
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

    const refreshToken =
      (data as any)?.meta?.refreshToken ||
      (data as any)?.meta?.refresh_token ||
      (data as any)?.refreshToken ||
      (data as any)?.refresh_token ||
      (data as any)?.data?.refreshToken ||
      (data as any)?.data?.refresh_token ||
      (attrs as any)?.refreshToken ||
      (attrs as any)?.refresh_token;

    if (accessToken) {
      console.log("[EgresadoAuthService.login] Guardando accessToken en localStorage");
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    } else {
      console.warn("[EgresadoAuthService.login] No se encontró accessToken en la respuesta");
    }

    if (refreshToken) {
      console.log("[EgresadoAuthService.login] Guardando refreshToken en localStorage");
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_SCOPE, "egresado");
    localStorage.setItem(STORAGE_KEYS.EGRESADO_ID, data.data.id);

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
