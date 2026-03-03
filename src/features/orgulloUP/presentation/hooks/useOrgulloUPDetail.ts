import { useEffect, useState } from 'react';
import type { LogroAcademico, LogroLaboral } from '../../domain/OrgulloUP';
import { OrgulloUPDetailService } from '../../data/OrgulloUPDetailService';

interface UseOrgulloUPDetailParams {
  id: string | null;
  isOpen: boolean;
}

interface UseOrgulloUPDetailResult {
  sinopsis: string | null;
  logrosAcademicos: LogroAcademico[];
  logrosLaborales: LogroLaboral[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrgulloUPDetail = ({ id, isOpen }: UseOrgulloUPDetailParams): UseOrgulloUPDetailResult => {
  const [sinopsis, setSinopsis] = useState<string | null>(null);
  const [logrosAcademicos, setLogrosAcademicos] = useState<LogroAcademico[]>([]);
  const [logrosLaborales, setLogrosLaborales] = useState<LogroLaboral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = async () => {
    if (!id || !isOpen) {
      setSinopsis(null);
      setLogrosAcademicos([]);
      setLogrosLaborales([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [texto, academicos, laborales] = await Promise.all([
        OrgulloUPDetailService.getSinopsis(id),
        OrgulloUPDetailService.getLogrosAcademicos(id),
        OrgulloUPDetailService.getLogrosLaborales(id),
      ]);

      setSinopsis(texto ?? null);
      setLogrosAcademicos(academicos);
      setLogrosLaborales(laborales);
    } catch (err) {
      console.error('[OrgulloUP][Detail] Error al cargar datos del detalle:', err);
      setSinopsis(null);
      setLogrosAcademicos([]);
      setLogrosLaborales([]);
      setError('No se pudo cargar el detalle del egresado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, [id, isOpen]);

  return {
    sinopsis,
    logrosAcademicos,
    logrosLaborales,
    loading,
    error,
    refetch: loadDetail,
  };
};
