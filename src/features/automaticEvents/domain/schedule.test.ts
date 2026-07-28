/**
 * Self-check del traductor horario ↔ cron. Sin framework: se corre con
 *   npx tsx src/features/automaticEvents/domain/schedule.test.ts
 * o pegando el equivalente en la consola. Falla ruidosamente si algo se rompe.
 */
import assert from 'node:assert/strict';
import {
    describir,
    fromCron,
    proximaEjecucion,
    toCron,
    type Horario,
} from './schedule';

const h = (p: Partial<Horario>): Horario => ({
    frecuencia: 'diario', hora: 9, minuto: 0, diaSemana: 1, diaMes: 1, ...p,
});

// toCron cubre los 4 patrones ofrecidos
assert.equal(toCron(h({ frecuencia: 'diario' })), '0 9 * * *');
assert.equal(toCron(h({ frecuencia: 'habiles', hora: 7, minuto: 30 })), '30 7 * * 1-5');
assert.equal(toCron(h({ frecuencia: 'semanal', diaSemana: 3 })), '0 9 * * 3');
assert.equal(toCron(h({ frecuencia: 'mensual', diaMes: 15 })), '0 9 15 * *');

// fromCron es el inverso exacto de toCron
for (const caso of [
    h({ frecuencia: 'diario', hora: 0, minuto: 5 }),
    h({ frecuencia: 'habiles', hora: 23, minuto: 59 }),
    h({ frecuencia: 'semanal', diaSemana: 0 }),
    h({ frecuencia: 'mensual', diaMes: 28 }),
]) {
    const vuelta = fromCron(toCron(caso));
    assert.equal(vuelta.frecuencia, caso.frecuencia);
    assert.equal(vuelta.hora, caso.hora);
    assert.equal(vuelta.minuto, caso.minuto);
}

// Un cron fuera de los patrones NO se disfraza de horario simple
for (const raro of ['*/5 * * * *', '0 9 * 3 *', '0 9 1,15 * *', 'basura', '0 9 * *']) {
    assert.equal(fromCron(raro).frecuencia, 'personalizado', `debió ser personalizado: ${raro}`);
}
assert.equal(fromCron(null).frecuencia, 'diario');

// proximaEjecucion respeta la frecuencia y siempre cae en el futuro
const lunes10am = new Date(2026, 6, 27, 10, 0, 0); // 27 jul 2026 = lunes

const diario = proximaEjecucion(h({ frecuencia: 'diario', hora: 9 }), lunes10am)!;
assert.equal(diario.getDate(), 28, 'diario 9am ya pasó hoy -> mañana');

const hoyMasTarde = proximaEjecucion(h({ frecuencia: 'diario', hora: 18 }), lunes10am)!;
assert.equal(hoyMasTarde.getDate(), 27, 'diario 18h aún no pasa -> hoy');

const habiles = proximaEjecucion(h({ frecuencia: 'habiles', hora: 9 }), new Date(2026, 6, 31, 10, 0))!;
assert.equal(habiles.getDay(), 1, 'viernes tarde -> siguiente hábil es lunes');

const semanal = proximaEjecucion(h({ frecuencia: 'semanal', diaSemana: 3, hora: 9 }), lunes10am)!;
assert.equal(semanal.getDay(), 3, 'semanal miércoles');

// Mensual día 28 partiendo de un febrero: debe existir, no saltarse el mes
const mensual = proximaEjecucion(h({ frecuencia: 'mensual', diaMes: 28, hora: 9 }), new Date(2027, 1, 1, 0, 0))!;
assert.equal(mensual.getDate(), 28);
assert.equal(mensual.getMonth(), 1, 'febrero sí tiene día 28');

assert.equal(proximaEjecucion(fromCron('*/5 * * * *'), lunes10am), null, 'cron personalizado no se estima');

// describir produce frases, no crons
assert.equal(describir(h({ frecuencia: 'mensual', diaMes: 15, hora: 14, minuto: 30 })), 'El día 15 de cada mes a las 14:30');
assert.equal(describir(h({ frecuencia: 'semanal', diaSemana: 5 })), 'Cada viernes a las 09:00');

console.log('schedule.ts OK');
