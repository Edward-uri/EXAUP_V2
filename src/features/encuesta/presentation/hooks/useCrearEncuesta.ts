import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../../shared/components/Alert';
import { FormularioService } from '../../../formulario/data/FormularioService';
import { TemplateService } from '../../../template/data/TemplateService';
import { EncuestaService } from '../../data/EncuestaService';
import type { Formulario } from '../../../formulario/domain/Formulario';
import type { TemplateCorreo } from '../../../template/domain/TemplateCorreo';

export const useCrearEncuesta = () => {
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [templates, setTemplates] = useState<TemplateCorreo[]>([]);
    
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const navigate = useNavigate();
    const alert = useAlert();

    // 1. Cargar las listas (Dropdowns) al iniciar
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                // Ejecutamos ambas peticiones en paralelo para ser más rápidos
                const [formsData, templatesData] = await Promise.all([
                    FormularioService.getAll(),
                    TemplateService.getAll()
                ]);
                
                setFormularios(formsData);
                setTemplates(templatesData);
            } catch (error) {
                console.error("Error cargando dependencias:", error);
                alert.error('Error al cargar', 'Error al cargar formularios o plantillas. Revisa tu conexión.');
            } finally {
                setLoadingData(false);
            }
        };

        loadDependencies();
    }, []);

    // 2. Función para Crear la Encuesta
    const createEncuesta = async (nombre: string, descripcion: string, formId: string, templateId: string) => {
        setSaving(true);
        try {
            const encuestaCreada = await EncuestaService.create(nombre, descripcion, formId, templateId);
            alert.success('Encuesta creada', 'La encuesta se ha creado exitosamente.');
            // Redirigir a la página de gestión
            navigate(`/encuestas/${encuestaCreada.id}/gestionar`);
        } catch (error) {
            console.error(error);
            alert.error('Error al crear', 'Ocurrió un error al crear la encuesta.');
        } finally {
            setSaving(false);
        }
    };

    return {
        formularios,
        templates,
        loadingData,
        saving,
        createEncuesta
    };
};