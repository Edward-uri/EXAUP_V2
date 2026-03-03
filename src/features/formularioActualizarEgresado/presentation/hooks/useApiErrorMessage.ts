import { useCallback } from 'react';

export const useApiErrorMessage = () => {
  const getApiErrorMessage = useCallback((err: any, fallback: string) => {
    const status = err?.response?.status as number | undefined;

    if (!err?.response) {
      console.error('[API] Error de red o sin respuesta', err);
      return 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.';
    }

    if (status === 400) {
      return 'Los datos enviados no son válidos. Revisa la información e inténtalo de nuevo.';
    }

    if (status === 401 || status === 403) {
      return 'Tu sesión no es válida o no tienes permiso para realizar esta acción. Intenta volver a iniciar sesión.';
    }

    if (status === 404) {
      return 'No encontramos información con los datos proporcionados. Verifica la información e inténtalo nuevamente.';
    }

    if (status && status >= 500) {
      return 'Ocurrió un problema en el servidor. Inténtalo nuevamente más tarde.';
    }

    console.error('[API] Error no controlado', { status, err });
    return fallback;
  }, []);

  return getApiErrorMessage;
};
