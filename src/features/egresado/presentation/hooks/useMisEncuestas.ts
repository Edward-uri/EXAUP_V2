import { useCallback, useEffect, useState } from 'react';
import { getSessionEgresadoId } from '../../../../core/auth-context';
import { MisEncuestasService } from '../../data/MisEncuestasService';
import type { MiEncuesta } from '../../domain/MiEncuesta';

export function useMisEncuestas() {
    const [encuestas, setEncuestas] = useState<MiEncuesta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        const egresadoId = getSessionEgresadoId();
        if (!egresadoId) {
            setEncuestas([]);
            setError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            setEncuestas(await MisEncuestasService.getMisEncuestas(egresadoId));
        } catch {
            setError('No se pudieron cargar tus encuestas. Intenta de nuevo.');
            setEncuestas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const pendientes = encuestas.filter((e) => e.estado === 'pendiente');
    const respondidas = encuestas.filter((e) => e.estado === 'respondida');

    return { encuestas, pendientes, respondidas, loading, error, refetch: load };
}
