import { useState, useEffect } from 'react';
import { EncuestaService } from '../../data/EncuestaService';
import type { Encuesta } from '../../domain/Encuesta';
import { useAlert } from '../../../../shared/components/Alert';

export const useEncuestasList = () => {
    const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const alert = useAlert();

    const loadEncuestas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await EncuestaService.getAll(true);
            setEncuestas(data);
        } catch (err: any) {
            console.error('Error cargando encuestas:', err);

            if (!err?.response) {
                setError('CONNECTION_ERROR');
            } else {
                setError('No se pudieron cargar las encuestas');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEncuestas();
    }, []);

    const deleteEncuesta = async (id: string) => {
        // La confirmación visual ahora debe hacerse desde la UI usando el Modal/ConfirmModal compartido
        try {
            await EncuestaService.delete(id);

            /* DELETE /encuestas/:id responde 200 aunque no borre nada (verificado
               2026-07-28: el registro sigue en el listado, y un id inexistente
               también devuelve 204). Por eso se confirma contra el servidor en vez
               de quitar la fila a ciegas: si no, la encuesta "desaparece" y vuelve
               al recargar. */
            const frescas = await EncuestaService.getAll();
            setEncuestas(frescas);

            if (frescas.some(e => String(e.id) === String(id))) {
                alert.error(
                    'No se pudo eliminar',
                    'El servidor aceptó la petición pero la encuesta sigue existiendo. Repórtalo al equipo de backend.'
                );
                return;
            }

            alert.success('Encuesta eliminada', 'La encuesta se eliminó correctamente.');
        } catch (err) {
            console.error('Error eliminando encuesta:', err);
            alert.error('Error al eliminar', 'No se pudo eliminar la encuesta.');
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const updated = await EncuestaService.toggleActive(id, !currentStatus);
            setEncuestas(prev => prev.map(e => e.id === id ? updated : e));
            alert.success(
                currentStatus ? 'Encuesta desactivada' : 'Encuesta activada',
                currentStatus
                    ? 'Dejó de recibir respuestas.'
                    : 'Ya puede recibir respuestas de nuevo.'
            );
        } catch (err) {
            console.error('Error actualizando estado:', err);
            alert.error('Error al actualizar', 'No se pudo actualizar el estado.');
        }
    };

    return {
        encuestas,
        loading,
        error,
        deleteEncuesta,
        toggleActive,
        refetch: loadEncuestas
    };
};
