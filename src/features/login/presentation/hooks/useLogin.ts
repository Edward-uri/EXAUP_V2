import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginService } from "../../data/LoginService";
import { useAlert } from "../../../../shared/components/Alert";
import { ROUTES } from "../../../../constants/routes";

const CONNECTION_ERROR_MESSAGE =
  "No se pudo conectar con el servidor. Verifica tu conexion a internet o intenta de nuevo en unos minutos.";

function hasTechnicalConnectionError(value: unknown): boolean {
  const text = String(value ?? "").toLowerCase();
  return (
    text.includes("econnreset") ||
    text.includes("econnrefused") ||
    text.includes("network error") ||
    text.includes("failed to fetch") ||
    text.includes("timeout") ||
    text.includes("socket hang up")
  );
}

function hasInvalidCredentialsError(value: unknown): boolean {
  const text = String(value ?? "").toLowerCase();
  return (
    text.includes("incorrect") ||
    text.includes("invalid credentials") ||
    text.includes("credenciales") ||
    text.includes("contrasena") ||
    text.includes("contraseña") ||
    text.includes("password") ||
    text.includes("unauthorized") ||
    text.includes("no autorizado")
  );
}

function isLikelyInvalidLogin(err: any, backendMessage: unknown): boolean {
  const status = Number(err?.response?.status);
  const requestUrl = String(err?.config?.url ?? "").toLowerCase();
  const isLoginRequest = requestUrl.includes("/auth/staff/login");

  if (hasInvalidCredentialsError(backendMessage) || hasInvalidCredentialsError(err?.message)) {
    return true;
  }

  // Para login, tratamos errores 4xx como credenciales inválidas.
  if (isLoginRequest && [400, 401, 403, 404, 422].includes(status)) {
    return true;
  }

  // Algunos backends devuelven 500 con mensajes técnicos al validar credenciales.
  if (
    isLoginRequest &&
    status === 500 &&
    (hasTechnicalConnectionError(backendMessage) || hasTechnicalConnectionError(err?.message))
  ) {
    return true;
  }

  return false;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const alert = useAlert();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      await LoginService.login(email, password);

      alert.success("Inicio de sesión", "Has iniciado sesión correctamente.");
      navigate(ROUTES.HOME);
    } catch (err: any) {
      console.error("Error en login:", err);
      let message: string;
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;

      if (isLikelyInvalidLogin(err, backendMessage)) {
        message = "Correo o contraseña incorrectos.";
      } else if (
        !err?.response ||
        hasTechnicalConnectionError(err?.code) ||
        hasTechnicalConnectionError(err?.message) ||
        hasTechnicalConnectionError(backendMessage)
      ) {
        message = CONNECTION_ERROR_MESSAGE;
      } else {
        message =
          backendMessage ||
          "No se pudo iniciar sesión. Inténtalo de nuevo más tarde.";
      }
      setError(message);
      alert.error("Error al iniciar sesión", message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
  };
};
