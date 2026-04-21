import { useState, useEffect } from 'react';
import { GrupoService } from '../../data/GrupoService';
import type { Grupo, MiembroGrupo } from '../../domain/Grupo';
import { useAlert } from '../../../../shared/components/Alert';

export function useEditarGrupo(id: string | undefined) {
    const [grupo, setGrupo] = useState<Grupo | null>(null);
    const [miembros, setMiembros] = useState<MiembroGrupo[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const alert = useAlert();

    const fetchAll = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [grupoData, miembrosData] = await Promise.all([
                GrupoService.getById(id),
                GrupoService.getMembers(id)
            ]);
            setGrupo(grupoData);
            setMiembros(miembrosData);
        } catch (error) {
            console.error('Error fetching grupo details:', error);
            alert.error('Error', 'No se pudo cargar la información del grupo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [id]);

    const updateGrupo = async (nombre: string, descripcion: string) => {
        if (!id) return;
        setUpdating(true);
        try {
            const updated = await GrupoService.update(id, {
                data: {
                    type: 'grupos',
                    attributes: { nombre, descripcion }
                }
            });
            setGrupo(updated);
            alert.success('Actualizado', 'El grupo se actualizó correctamente');
        } catch (error) {
            console.error('Error updating grupo:', error);
            alert.error('Error', 'No se pudo actualizar el grupo');
            throw error;
        } finally {
            setUpdating(false);
        }
    };

    const removeMember = async (idEgresado: string) => {
        if (!id) return;
        try {
            await GrupoService.removeMember(id, idEgresado);
            setMiembros(prev => prev.filter(m => m.attributes.id_egresado.toString() !== idEgresado));
            alert.success('Eliminado', 'Miembro eliminado del grupo');
        } catch (error) {
            console.error('Error removing member:', error);
            alert.error('Error', 'No se pudo eliminar al miembro');
            throw error;
        }
    };

    return {
        grupo,
        miembros,
        loading,
        updating,
        updateGrupo,
        removeMember
    };
}