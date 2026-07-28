/**
 * El API nombra los tipos de pregunta con slugs técnicos (`boolean`, `likert`).
 * Esos nombres no se muestran nunca al usuario: aquí viven las etiquetas que sí
 * se enseñan.
 *
 * Existía la misma tabla copiada en 4 vistas y dos copias estaban incompletas,
 * por eso el preview enseñaba "boolean" y "likert" en crudo. Una sola fuente.
 */
const ETIQUETAS: Record<string, { label: string; descripcion: string }> = {
    'abierta': { label: 'Respuesta abierta', descripcion: 'Texto libre' },
    'opción múltiple': { label: 'Opción múltiple', descripcion: 'Una sola respuesta' },
    'opcion multiple': { label: 'Opción múltiple', descripcion: 'Una sola respuesta' },
    'boolean': { label: 'Sí / No', descripcion: 'Respuesta de sí o no' },
    'likert': { label: 'Escala de acuerdo', descripcion: 'De "totalmente en desacuerdo" a "totalmente de acuerdo"' },
    'casillas': { label: 'Casillas', descripcion: 'Varias respuestas' },
};

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const buscar = (nombre: string | null | undefined) =>
    nombre ? ETIQUETAS[nombre.toLowerCase().trim()] : undefined;

/** Etiqueta legible del tipo. Un tipo nuevo del backend cae a capitalizado, nunca al slug crudo. */
export const tipoPreguntaLabel = (nombre: string | null | undefined): string =>
    buscar(nombre)?.label ?? (nombre ? capitalizar(nombre) : 'Respuesta abierta');

/** Frase de apoyo para el constructor de formularios. Vacía si el tipo no está mapeado. */
export const tipoPreguntaDescripcion = (nombre: string | null | undefined): string =>
    buscar(nombre)?.descripcion ?? '';
