export type EstadoEncuestaEgresado = 'pendiente' | 'respondida';

export interface MiEncuesta {
    id: string;
    nombre: string;
    descripcion?: string;
    estado: EstadoEncuestaEgresado;
    uuid?: string;
    fechaEnvio?: string;
    fechaRespuesta?: string;
}
