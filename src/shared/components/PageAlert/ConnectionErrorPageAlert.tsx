import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConnectionErrorPageAlertProps {
  onRetry?: () => void;
}

export function ConnectionErrorPageAlert({ onRetry }: ConnectionErrorPageAlertProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Fallback simple: recargar la página
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="rounded-2xl bg-white shadow-xl border border-red-100 px-6 py-7 sm:px-8 sm:py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Error de conexión</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
            No podemos conectarnos al servidor
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Parece que hubo un problema con tu conexión o con el servidor de EXAUP. Revisa tu red o inténtalo de nuevo en unos momentos.
          </p>

          <button
            onClick={handleRetry}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5"
          >
            Reintentar conexión
            <ArrowPathIcon className="ml-2 h-4 w-4" />
          </button>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Si el problema persiste, contacta al administrador de la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
