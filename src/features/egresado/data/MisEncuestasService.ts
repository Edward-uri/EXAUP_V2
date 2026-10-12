import { apiClient } from '../../../core/api.config';
import type { MiEncuesta, EstadoEncuestaEgresado } from '../domain/MiEncuesta';

function normalizarEstado(valor: unknown): EstadoEncuestaEgresado {
    const v = String(valor ?? '').toLowerCase();
    if (v.includes('respond') || v.includes('contest') || v === 'completada') {
        return 'respondida';
    }
    return 'pendiente';
}

function mapMiEncuesta(item: unknown): MiEncuesta {
    const raw = (item ?? {}) as Record<string, unknown>;
    const attrs = (raw.attributes ?? raw) as Record<string, unknown>;
    const pick = (...keys: string[]): string | undefined => {
        for (const k of keys) {
            const value = attrs[k];
            if (typeof value === 'string' && value.trim().length > 0) return value;
        }
        return undefined;
    };

    return {
        id: String(raw.id ?? attrs.id ?? ''),
        nombre: pick('nombre', 'titulo', 'name') ?? 'Encuesta',
        descripcion: pick('descripcion', 'description'),
        estado: normalizarEstado(attrs.estado ?? attrs.status ?? attrs.estatus),
        uuid: pick('uuid', 'token', 'link_uuid'),
        fechaEnvio: pick('fecha_envio', 'fechaEnvio', 'created_at'),
        fechaRespuesta: pick('fecha_respuesta', 'fechaRespuesta', 'respondida_en'),
    };
}

export const MisEncuestasService = {
    getMisEncuestas: async (egresadoId: string): Promise<MiEncuesta[]> => {
        const { data } = await apiClient.get(`/egresado/${egresadoId}/encuestas`);
        const raw = Array.isArray((data as { data?: unknown })?.data)
            ? (data as { data: unknown[] }).data
            : Array.isArray(data)
                ? (data as unknown[])
                : [];
        return raw.map(mapMiEncuesta);
    },
};
