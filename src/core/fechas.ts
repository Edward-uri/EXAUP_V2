import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * date-fns devuelve el locale español en minúscula ("en alrededor de 5 horas").
 * Cuando el texto abre una celda o una línea se ve como error de captura, así
 * que se capitaliza aquí y no en cada tabla.
 */
const capitalizar = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

/** "Hace 3 días", "En alrededor de 5 horas". Devuelve `respaldo` si la fecha no es válida. */
export function fechaRelativa(fecha: string | Date | null | undefined, respaldo = '-'): string {
    if (!fecha) return respaldo;
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(d.getTime())) return respaldo;
    return capitalizar(formatDistanceToNow(d, { addSuffix: true, locale: es }));
}

/** "20 de enero de 1986". Devuelve `respaldo` si la fecha no es válida. */
export function fechaLarga(fecha: string | Date | null | undefined, respaldo = '—'): string {
    if (!fecha) return respaldo;
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(d.getTime())) return respaldo;
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}
