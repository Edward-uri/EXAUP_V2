import { useState, useEffect, useCallback } from 'react';
import { FormularioService } from '../../data/FormularioService';
import type { Formulario } from '../../domain/Formulario';

export const useFormulariosList = () => {
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFormularios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await FormularioService.getAll();
            setFormularios(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los formularios.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFormularios();
    }, [loadFormularios]);

    const deleteFormulario = async (id: string): Promise<boolean> => {
        try {
            await FormularioService.delete(id);
            setFormularios(prev => prev.filter(f => f.id !== id));
            return true;
        } catch (e) {
            console.error('Error al eliminar:', e);
            return false;
        }
    };

    const toggleFormularioActive = async (id: string, isActive: boolean): Promise<boolean> => {
        try {
            const updated = await FormularioService.toggleActive(id, isActive);
            setFormularios(prev => prev.map(f => 
                f.id === id ? { ...f, attributes: { ...f.attributes, is_active: updated.attributes.is_active } } : f
            ));
            return true;
        } catch (e) {
            console.error('Error al cambiar estado:', e);
            return false;
        }
    };

    return {
        formularios,
        loading,
        error,
        refresh: loadFormularios,
        deleteFormulario,
        toggleFormularioActive
    };
};