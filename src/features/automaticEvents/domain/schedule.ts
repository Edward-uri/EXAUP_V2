/**
 * Traduce entre la expresión cron que pide el backend y un horario que una
 * persona puede elegir sin saber qué es un cron.
 *
 * Solo cubre los 4 patrones que la plataforma ofrece. Cualquier cron fuera de
 * esos patrones se marca como `personalizado` y se muestra tal cual en vez de
 * intentar adivinar: es preferible a mentirle al usuario sobre cuándo se envía.
 *
 * Formato cron: `minuto hora díaDelMes mes díaDeLaSemana`
 */

export type Frecuencia = 'diario' | 'habiles' | 'semanal' | 'mensual' | 'personalizado';

export interface Horario {
    frecuencia: Frecuencia;
    hora: number;
    minuto: number;
    /** 0 = domingo … 6 = sábado. Solo aplica a `semanal`. */
    diaSemana: number;
    /** 1–28. Solo aplica a `mensual`. Se topa en 28 para que exista en febrero. */
    diaMes: number;
    /** Cron original cuando la frecuencia es `personalizado`. */
    cronCrudo?: string;
}

export const HORARIO_POR_DEFECTO: Horario = {
    frecuencia: 'diario',
    hora: 9,
    minuto: 0,
    diaSemana: 1,
    diaMes: 1,
};

export const DIAS_SEMANA = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
] as const;

export const OPCIONES_FRECUENCIA: { value: Exclude<Frecuencia, 'personalizado'>; label: string; ayuda: string }[] = [
    { value: 'diario', label: 'Todos los días', ayuda: 'Se envía los 7 días de la semana.' },
    { value: 'habiles', label: 'Días hábiles', ayuda: 'De lunes a viernes, sin fines de semana.' },
    { value: 'semanal', label: 'Una vez por semana', ayuda: 'Se envía el día que elijas, cada semana.' },
    { value: 'mensual', label: 'Una vez al mes', ayuda: 'Se envía el día del mes que elijas.' },
];

export function toCron(h: Horario): string {
    if (h.frecuencia === 'personalizado') return h.cronCrudo ?? '0 9 * * *';
    const m = h.minuto;
    const hh = h.hora;
    switch (h.frecuencia) {
        case 'habiles': return `${m} ${hh} * * 1-5`;
        case 'semanal': return `${m} ${hh} * * ${h.diaSemana}`;
        case 'mensual': return `${m} ${hh} ${h.diaMes} * *`;
        default: return `${m} ${hh} * * *`;
    }
}

export function fromCron(cron: string | null | undefined): Horario {
    if (!cron) return { ...HORARIO_POR_DEFECTO };
    const p = cron.trim().split(/\s+/);
    const personalizado = (): Horario => ({ ...HORARIO_POR_DEFECTO, frecuencia: 'personalizado', cronCrudo: cron });
    if (p.length !== 5) return personalizado();

    const [min, hor, dom, mes, dow] = p;
    const minuto = Number(min);
    const hora = Number(hor);
    // Una hora fija es el único caso que sabemos describir con certeza.
    if (!Number.isInteger(minuto) || !Number.isInteger(hora) || mes !== '*') return personalizado();
    if (minuto < 0 || minuto > 59 || hora < 0 || hora > 23) return personalizado();

    const base = { ...HORARIO_POR_DEFECTO, hora, minuto };
    if (dom === '*' && dow === '*') return { ...base, frecuencia: 'diario' };
    if (dom === '*' && dow === '1-5') return { ...base, frecuencia: 'habiles' };
    if (dom === '*' && /^[0-6]$/.test(dow)) return { ...base, frecuencia: 'semanal', diaSemana: Number(dow) };
    if (dow === '*' && /^([1-9]|1\d|2[0-8])$/.test(dom)) return { ...base, frecuencia: 'mensual', diaMes: Number(dom) };
    return personalizado();
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');

export const horaLegible = (h: number, m: number) => `${dosDigitos(h)}:${dosDigitos(m)}`;

/** Frase que se le muestra al usuario para confirmar lo que acaba de programar. */
export function describir(h: Horario): string {
    if (h.frecuencia === 'personalizado') {
        return `Programación avanzada (cron: ${h.cronCrudo}). Edítala desde el servidor si necesitas cambiarla.`;
    }
    const hora = horaLegible(h.hora, h.minuto);
    switch (h.frecuencia) {
        case 'habiles': return `De lunes a viernes a las ${hora}`;
        case 'semanal': return `Cada ${DIAS_SEMANA[h.diaSemana]} a las ${hora}`;
        case 'mensual': return `El día ${h.diaMes} de cada mes a las ${hora}`;
        default: return `Todos los días a las ${hora}`;
    }
}

/**
 * Próxima ejecución a partir de `desde`, en hora local del navegador.
 * El backend programa en `America/Mexico_City`; si el equipo está en otra zona
 * la hora mostrada puede diferir, por eso la UI acompaña esto con la zona.
 */
export function proximaEjecucion(h: Horario, desde: Date): Date | null {
    if (h.frecuencia === 'personalizado') return null;

    const cand = new Date(desde);
    cand.setHours(h.hora, h.minuto, 0, 0);

    const sirve = (d: Date) => {
        if (d <= desde) return false;
        switch (h.frecuencia) {
            case 'habiles': return d.getDay() >= 1 && d.getDay() <= 5;
            case 'semanal': return d.getDay() === h.diaSemana;
            case 'mensual': return d.getDate() === h.diaMes;
            default: return true;
        }
    };

    // 400 días cubre de sobra el peor caso (mensual saltando meses cortos).
    for (let i = 0; i < 400; i++) {
        if (sirve(cand)) return cand;
        cand.setDate(cand.getDate() + 1);
        cand.setHours(h.hora, h.minuto, 0, 0);
    }
    return null;
}
