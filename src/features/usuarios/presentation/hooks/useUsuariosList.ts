import { useCallback, useEffect, useState } from 'react';
import { UsuarioService, mensajeDeError } from '../../data/UsuarioService';
import type { RolUsuario, Usuario } from '../../domain/Usuario';

export function useUsuariosList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<RolUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [lista, listaRoles] = await Promise.all([
                UsuarioService.getAll(),
                UsuarioService.getRoles(),
            ]);
            setUsuarios(lista);
            setRoles(listaRoles);
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo cargar la lista de usuarios.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    return { usuarios, roles, loading, error, recargar: cargar };
}