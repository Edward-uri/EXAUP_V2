import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutomaticEventService } from '../../data/AutomaticEventService';
import { TemplateService } from '../../../template/data/TemplateService';
import type { TemplateCorreo } from '../../../template/domain/TemplateCorreo';
import type { CreateEventRequest } from '../../domain/AutomaticEvent';
import { useAlert } from '../../../../shared/components/Alert';
import { ROUTES } from '../../../../constants/routes';

export function useEventForm(id?: string) {
    const navigate = useNavigate();
    const alert = useAlert();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(!!id);
    const [templates, setTemplates] = useState<TemplateCorreo[]>([]);

    const [formData, setFormData] = useState<CreateEventRequest>({
        name: '',
        event_type: 'birthday_dispatch',
        cron_expression: '0 9 * * *',
        timezone: 'America/Mexico_City',
        is_active: true,
        starts_at: new Date().toISOString(),
        ends_at: null,
        payload: {
            id_template: 0,
            reference_date: ''
        }
    });

    useEffect(() => {
        // Load templates
        TemplateService.getAll()
            .then(setTemplates)
            .catch(err => {
                console.error('Error loading templates:', err);
                alert.error('Error', 'No se pudieron cargar las plantillas de correo');
            });

        // If edit mode, load event
        if (id) {
            AutomaticEventService.getById(id)
                .then(event => {
                    setFormData({
                        name: event.name,
                        event_type: event.event_type,
                        cron_expression: event.cron_expression,
                        timezone: event.timezone,
                        is_active: event.is_active,
                        starts_at: event.starts_at,
                        ends_at: event.ends_at,
                        payload: event.payload
                    });
                })
                .catch(err => {
                    console.error('Error loading event:', err);
                    alert.error('Error', 'No se pudo cargar el evento');
                })
                .finally(() => setLoadingData(false));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await AutomaticEventService.update(id, formData);
                alert.success('Actualizado', 'Evento actualizado correctamente');
            } else {
                await AutomaticEventService.create(formData);
                alert.success('Creado', 'Evento creado correctamente');
            }
            navigate(ROUTES.EVENTOS_AUTOMATICOS);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert.error('Error', 'Hubo un problema al guardar el evento');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        templates,
        loading,
        loadingData,
        handleSubmit
    };
}
