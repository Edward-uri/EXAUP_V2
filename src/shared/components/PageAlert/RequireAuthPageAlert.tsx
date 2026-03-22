import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "../../../core/api.config";
import { ROUTES } from "../../../constants/routes";
import { LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export function RequireAuthPageAlert() {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    const hasToken = !!token;
    const hasUser = !!user;

    // Aceptamos sesión por token o por usuario persistido (backend por cookie)
    setIsAuthenticated(hasToken || hasUser);

    setChecking(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && location.pathname === ROUTES.LOGIN) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (checking || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200/80 px-6 py-7 sm:px-8 sm:py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
            <LockClosedIcon className="h-4 w-4" />
            <span>Acceso restringido</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
            Necesitas iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Para continuar y acceder a esta sección de EXAUP, inicia sesión con tu cuenta institucional.
          </p>

          <button
            onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
          >
            Ir a iniciar sesión
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Si ya iniciaste sesión en otra pestaña, actualiza esta página.
          </p>
        </div>
      </div>
    </div>
  );
}
