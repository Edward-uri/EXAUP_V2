import { useState, useEffect } from 'react';
import { AutomaticEventService } from '../../data/AutomaticEventService';
import type { AutomaticEvent } from '../../domain/AutomaticEvent';
import { useAlert } from '../../../../shared/components/Alert';

export function useAutomaticEventsList() {
    const [events, setEvents] = useState<AutomaticEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const alert = useAlert();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await AutomaticEventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            alert.error('Error', 'No se pudieron cargar los eventos automáticos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            if (currentStatus) {
                await AutomaticEventService.deactivate(id);
                alert.success('Desactivado', 'Evento desactivado correctamente');
            } else {
                await AutomaticEventService.activate(id);
                alert.success('Activado', 'Evento activado correctamente');
            }
            setEvents(prev => prev.map(e => e.id === id ? { ...e, is_active: !currentStatus } : e));
        } catch (error) {
            console.error('Error toggling event status:', error);
            alert.error('Error', 'No se pudo cambiar el estado del evento');
        }
    };

    const triggerEvent = async (id: number) => {
        try {
            await AutomaticEventService.trigger(id);
            alert.success('Ejecutado', 'La ejecución manual ha sido iniciada');
        } catch (error) {
            console.error('Error triggering event:', error);
            alert.error('Error', 'No se pudo ejecutar el evento manualmente');
        }
    };

    return {
        events,
        loading,
        toggleStatus,
        triggerEvent,
        refetch: fetchEvents
    };
}
