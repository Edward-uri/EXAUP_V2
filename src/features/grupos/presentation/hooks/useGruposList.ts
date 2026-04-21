import { useState, useEffect } from 'react';
import { GrupoService } from '../../data/GrupoService';
import type { Grupo } from '../../domain/Grupo';
import { useAlert } from '../../../../shared/components/Alert';

export function useGruposList() {
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const alert = useAlert();

    const fetchGrupos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await GrupoService.getAll();
            setGrupos(data);
        } catch (err: any) {
            console.error('Error fetching grupos:', err);
            setError(err.response?.status === 0 ? 'CONNECTION_ERROR' : 'Error al cargar los grupos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrupos();
    }, []);

    const deleteGrupo = async (id: string) => {
        try {
            await GrupoService.delete(id);
            setGrupos(prev => prev.filter(g => g.id !== id));
            alert.success('Eliminado', 'Grupo eliminado correctamente');
        } catch (err) {
            console.error('Error deleting grupo:', err);
            alert.error('Error', 'No se pudo eliminar el grupo');
            throw err;
        }
    };

    return {
        grupos,
        loading,
        error,
        deleteGrupo,
        refetch: fetchGrupos
    };
}