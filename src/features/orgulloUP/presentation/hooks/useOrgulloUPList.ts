import { useEffect, useState } from 'react';
import { OrgulloUPService } from '../../data/OrgulloUPService';
import type { OrgulloUPRecord, OrgulloUPMeta } from '../../domain/OrgulloUP';

interface UseOrgulloUPListResult {
  records: OrgulloUPRecord[];
  meta: OrgulloUPMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrgulloUPList = (): UseOrgulloUPListResult => {
  const [records, setRecords] = useState<OrgulloUPRecord[]>([]);
  const [meta, setMeta] = useState<OrgulloUPMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortByMostRecent = (items: OrgulloUPRecord[]) =>
    items.slice().sort((a, b) => Number(b.id) - Number(a.id));

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await OrgulloUPService.getAll(1, 1000);
      console.log('[OrgulloUP][List] Registros cargados:', response.data.map(r => ({
        id: r.id,
        imagen_egresado: r.attributes.egresado.imagen_egresado,
      })));
      setRecords(sortByMostRecent(response.data));
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
  }, []);

  return {
    records,
    meta,
    loading,
    error,
    refetch: loadRecords,
  };
};
