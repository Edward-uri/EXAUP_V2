import { useEffect, useState } from 'react';
import type { OrgulloUPRecord, OrgulloUPMeta } from '../../domain/OrgulloUP';
import { EgresadosSearchService } from '../../data/EgresadosSearchService';

interface UseOrgulloUPListParams {
  page: number;
  limit: number;
  searchTerm: string;
}

interface UseOrgulloUPListResult {
  records: OrgulloUPRecord[];
  meta: OrgulloUPMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrgulloUPList = ({ page, limit, searchTerm }: UseOrgulloUPListParams): UseOrgulloUPListResult => {
  const [records, setRecords] = useState<OrgulloUPRecord[]>([]);
  const [meta, setMeta] = useState<OrgulloUPMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await EgresadosSearchService.search({
        page,
        limit,
        busqueda: searchTerm || undefined,
      });
      setRecords(response.data);
      setMeta(response.meta);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar los registros de Orgullo UP:', err);

      const status = err?.response?.status as number | undefined;

      if (!err?.response) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.');
      } else if (status === 404) {
        setError('No se encontraron registros de Orgullo UP.');
      } else if (status && status >= 500) {
        setError('Ocurrió un problema en el servidor al cargar los registros. Inténtalo nuevamente más tarde.');
      } else {
        setError('No se pudieron cargar los registros de Orgullo UP. Intenta nuevamente.');
      }

      setRecords([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  return {
    records,
    meta,
    loading,
    error,
    refetch: loadRecords,
  };
};
