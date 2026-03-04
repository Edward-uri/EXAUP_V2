import { useState, useEffect } from 'react';
import { EncuestaService } from '../../../encuesta/data/EncuestaService';
import { FormularioService } from '../../../formulario/data/FormularioService';
import type { Encuesta } from '../../../encuesta/domain/Encuesta';

interface HomeStats {
    encuestasActivas: number;
    formulariosCreados: number;
    totalRespuestas: number;
}

interface UseHomeStatsReturn {
    stats: HomeStats;
    recentSurveys: Encuesta[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useHomeStats(): UseHomeStatsReturn {
    const [stats, setStats] = useState<HomeStats>({
        encuestasActivas: 0,
        formulariosCreados: 0,
        totalRespuestas: 0
    });
    const [recentSurveys, setRecentSurveys] = useState<Encuesta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [encuestas, formularios] = await Promise.all([
                EncuestaService.getAll(true),
                FormularioService.getAll()
            ]);

            const encuestasActivas = encuestas.filter(e => e.attributes.is_active).length;
            
            setStats({
                encuestasActivas,
                formulariosCreados: formularios.length,
                totalRespuestas: 0
            });

            const sorted = [...encuestas].sort((a, b) => {
                const dateA = new Date(a.attributes.created_at || 0);
                const dateB = new Date(b.attributes.created_at || 0);
                return dateB.getTime() - dateA.getTime();
            });
            
            setRecentSurveys(sorted.slice(0, 5));
        } catch (err: any) {
            console.error('Error fetching home stats:', err);

            if (!err?.response) {
                setError('CONNECTION_ERROR');
            } else {
                setError('No se pudo cargar la información del dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        stats,
        recentSurveys,
        loading,
        error,
        refetch: fetchData
    };
}
