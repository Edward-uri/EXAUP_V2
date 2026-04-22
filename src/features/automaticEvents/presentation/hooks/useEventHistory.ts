import { useState, useEffect } from 'react';
import { AutomaticEventService } from '../../data/AutomaticEventService';
import type { AutomaticEvent, EventRun } from '../../domain/AutomaticEvent';
import { useAlert } from '../../../../shared/components/Alert';

export function useEventHistory(id?: string) {
    const [event, setEvent] = useState<AutomaticEvent | null>(null);
    const [runs, setRuns] = useState<EventRun[]>([]);
    const [loading, setLoading] = useState(true);
    const alert = useAlert();

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [eventData, runsData] = await Promise.all([
                AutomaticEventService.getById(id),
                AutomaticEventService.getRuns(id)
            ]);
            setEvent(eventData);
            setRuns(runsData);
        } catch (error) {
            console.error('Error fetching event history:', error);
            alert.error('Error', 'No se pudo cargar el historial de ejecuciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return {
        event,
        runs,
        loading,
        refetch: fetchData
    };
}
