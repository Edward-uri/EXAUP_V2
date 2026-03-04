import { ArrowRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { STORAGE_KEYS } from "../../../core/api.config";

export function SessionExpiredPageAlert() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRED);
    } catch {
      // ignore storage errors
    }

    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200/80 px-6 py-7 sm:px-8 sm:py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Sesión expirada</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
            Tu sesión ha expirado
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Por seguridad, tu sesión se cerró automáticamente. Inicia sesión de nuevo para continuar usando la plataforma EXAUP.
          </p>

          <button
            onClick={handleGoToLogin}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
          >
            Iniciar sesión de nuevo
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Si crees que esto es un error, intenta recargar la página después de iniciar sesión.
          </p>
        </div>
      </div>
    </div>
  );
}
