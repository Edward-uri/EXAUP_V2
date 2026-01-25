import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioService } from '../../data/FormularioService';
import type { Pregunta } from '../../domain/Pregunta';
import { PreguntaService } from '../../data/PreguntaService';
import { TipoPreguntaService } from '../../data/TipoPreguntaService';
import type { TipoPregunta } from '../../domain/TipoPregunta';

export const useFormularioBuilder = (formularioId?: string) => {
    const [tiposPregunta, setTiposPregunta] = useState<TipoPregunta[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formularioData, setFormularioData] = useState<{
        titulo: string;
        descripcion: string;
        preguntas: Pregunta[];
    } | null>(null);
    
    const navigate = useNavigate();

    // Cargar tipos al iniciar
    useEffect(() => {
        const loadTypes = async () => {
            try {
                const data = await TipoPreguntaService.getAll();
                setTiposPregunta(data);
            } catch (error) {
                console.error("Error cargando tipos:", error);
            }
        };
        loadTypes();
    }, []);

    // Cargar formulario existente si hay ID (modo edición)
    const loadFormulario = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const [formData, preguntasData] = await Promise.all([
                FormularioService.getById(id),
                FormularioService.getPreguntas(id)
            ]);

            // Mapear preguntas del API al formato de UI (incluyendo IDs de opciones)
            const preguntasUI: Pregunta[] = preguntasData
                .sort((a, b) => a.attributes.orden_en_formulario - b.attributes.orden_en_formulario)
                .map(p => ({
                    id: p.id,
                    texto: p.attributes.texto_pregunta,
                    tipoId: p.relationships.tipo_pregunta.data.id,
                    es_requerida: p.attributes.es_obligatoria === 1,
                    opciones: p.relationships.opciones?.map(op => ({ 
                        id: op.id,
                        texto: op.texto,
                        etiqueta: op.etiqueta
                    })) || []
                }));

            setFormularioData({
                titulo: formData.attributes.titulo,
                descripcion: formData.attributes.descripcion || '',
                preguntas: preguntasUI.length > 0 ? preguntasUI : [
                    { id: '1', texto: '', tipoId: '', es_requerida: false, opciones: [] }
                ]
            });
        } catch (error) {
            console.error("Error cargando formulario:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (formularioId) {
            loadFormulario(formularioId);
        }
    }, [formularioId, loadFormulario]);

    // FUNCIÓN: Crear formulario nuevo
    const saveFormularioCompleto = async (titulo: string, descripcion: string, preguntasUI: Pregunta[]) => {
        setSaving(true);
        try {
            // 1. Crear Formulario
            const formulario = await FormularioService.create(titulo, descripcion);
            const formId = formulario.id;

            // 2. Recorrer preguntas y guardarlas una por una
            for (let i = 0; i < preguntasUI.length; i++) {
                const pUI = preguntasUI[i];

                if (!pUI.tipoId) {
                    console.warn(`La pregunta "${pUI.texto}" no tiene tipo, se omitirá.`);
                    continue;
                }

                // A. Crear Pregunta en API
                const preguntaIdReal = await PreguntaService.create(
                    pUI.texto || "Pregunta sin título", 
                    pUI.tipoId,
                    pUI.es_requerida
                );

                // B. Asociar al Formulario
                await PreguntaService.asociarAFormulario(formId, preguntaIdReal, i + 1);

                // C. Si tiene opciones
                if (pUI.opciones && pUI.opciones.length > 0) {
                    for (let j = 0; j < pUI.opciones.length; j++) {
                        const opcion = pUI.opciones[j];
                        const etiqueta = String.fromCharCode(65 + j);
                        
                        await PreguntaService.createOpcion(
                            preguntaIdReal,
                            opcion.texto,
                            etiqueta
                        );
                    }
                }
            }

            navigate('/formularios');

        } catch (error) {
            console.error("Error crítico guardando formulario:", error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    // FUNCIÓN: Actualizar formulario existente
    const updateFormulario = async (id: string, titulo: string, descripcion: string, preguntasUI: Pregunta[]) => {
        setSaving(true);
        try {
            // 1. Actualizar metadatos del formulario
            await FormularioService.update(id, { titulo, descripcion });

            // 2. Obtener preguntas actuales del servidor
            const preguntasActuales = await FormularioService.getPreguntas(id);
            const preguntasActualesMap = new Map(preguntasActuales.map(p => [p.id, p]));
            const idsUI = new Set(preguntasUI.filter(p => !p.id.startsWith('new-') && !isNaN(Number(p.id))).map(p => p.id));

            // 3. Eliminar preguntas que ya no están en la UI
            for (const preguntaActual of preguntasActuales) {
                if (!idsUI.has(preguntaActual.id)) {
                    await FormularioService.removePregunta(id, preguntaActual.id);
                }
            }

            // 4. Procesar cada pregunta de la UI
            for (let i = 0; i < preguntasUI.length; i++) {
                const pUI = preguntasUI[i];
                
                if (!pUI.tipoId) continue;

                // Si es una pregunta nueva (id temporal)
                if (pUI.id.startsWith('new-') || !preguntasActualesMap.has(pUI.id)) {
                    // Crear nueva pregunta
                    const preguntaIdReal = await PreguntaService.create(
                        pUI.texto || "Pregunta sin título", 
                        pUI.tipoId,
                        pUI.es_requerida
                    );

                    await PreguntaService.asociarAFormulario(id, preguntaIdReal, i + 1);

                    // Crear opciones para la nueva pregunta
                    if (pUI.opciones && pUI.opciones.length > 0) {
                        for (let j = 0; j < pUI.opciones.length; j++) {
                            const opcion = pUI.opciones[j];
                            const etiqueta = String.fromCharCode(65 + j);
                            await PreguntaService.createOpcion(preguntaIdReal, opcion.texto, etiqueta);
                        }
                    }
                } else {
                    // Actualizar pregunta existente
                    await PreguntaService.update(
                        pUI.id,
                        pUI.texto || "Pregunta sin título",
                        pUI.tipoId,
                        pUI.es_requerida
                    );

                    // Manejar opciones de la pregunta existente
                    const preguntaActual = preguntasActualesMap.get(pUI.id);
                    const opcionesActuales = preguntaActual?.relationships.opciones || [];
                    const opcionesActualesMap = new Map(opcionesActuales.map(op => [op.id, op]));
                    const opcionesUIConId = pUI.opciones?.filter(op => op.id) || [];
                    const idsOpcionesUI = new Set(opcionesUIConId.map(op => op.id));

                    // Eliminar opciones que ya no están
                    for (const opcionActual of opcionesActuales) {
                        if (!idsOpcionesUI.has(opcionActual.id)) {
                            await PreguntaService.deleteOpcion(opcionActual.id);
                        }
                    }

                    // Actualizar o crear opciones
                    if (pUI.opciones && pUI.opciones.length > 0) {
                        for (let j = 0; j < pUI.opciones.length; j++) {
                            const opcion = pUI.opciones[j];
                            const etiqueta = String.fromCharCode(65 + j);

                            if (opcion.id && opcionesActualesMap.has(opcion.id)) {
                                // Actualizar opción existente
                                await PreguntaService.updateOpcion(
                                    opcion.id,
                                    opcion.texto,
                                    etiqueta,
                                    pUI.id
                                );
                            } else {
                                // Crear nueva opción
                                await PreguntaService.createOpcion(pUI.id, opcion.texto, etiqueta);
                            }
                        }
                    }
                }
            }

            navigate('/formularios');

        } catch (error) {
            console.error("Error actualizando formulario:", error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    return {
        tiposPregunta,
        saveFormularioCompleto,
        updateFormulario,
        saving,
        loading,
        formularioData
    };
};