import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginService } from "../../data/LoginService";
import { useAlert } from "../../../../shared/components/Alert";
import { ROUTES } from "../../../../constants/routes";

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

      if (err?.response?.status === 401) {
        message = "Correo o contraseña incorrectos.";
      } else if (!err?.response || err?.code === 'ECONNRESET' || String(err?.message || '').includes('ECONNRESET')) {
        message = "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o inténtalo de nuevo más tarde.";
      } else {
        message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
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
