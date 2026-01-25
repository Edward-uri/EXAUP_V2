import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
                alert("Error al cargar formularios o plantillas. Revisa tu conexión.");
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
            await EncuestaService.create(nombre, descripcion, formId, templateId);
            alert("¡Encuesta creada exitosamente!");
            navigate('/encuestas/enviar'); // O a la lista de encuestas
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear la encuesta.");
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