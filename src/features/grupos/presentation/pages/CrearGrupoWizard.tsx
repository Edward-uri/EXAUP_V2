import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    CheckIcon,
    FilterIcon,
    LoaderCircleIcon,
    UsersIcon,
    UsersRoundIcon,
} from 'lucide-react';
import { useCrearGrupoWizard } from '../hooks/useCrearGrupoWizard';
import { ROUTES } from '../../../../constants/routes';

const PASOS = [
    { id: 1, titulo: 'Datos del grupo', ayuda: 'Nombre y descripción' },
    { id: 2, titulo: 'Filtros', ayuda: 'A quién incluir' },
    { id: 3, titulo: 'Revisión', ayuda: 'Quiénes quedaron' },
    { id: 4, titulo: 'Confirmar', ayuda: 'Crear e importar' },
] as const;

const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20';

function Stepper({ actual }: { actual: number }) {
    return (
        <ol className="mb-8 flex items-start">
            {PASOS.map((paso, i) => {
                const hecho = paso.id < actual;
                const activo = paso.id === actual;
                return (
                    <li key={paso.id} className="flex flex-1 items-start last:flex-none">
                        <div className="flex flex-col items-center gap-1.5 text-center">
                            <span
                                aria-current={activo ? 'step' : undefined}
                                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                                    hecho
                                        ? 'bg-blue-950 text-white'
                                        : activo
                                        ? 'bg-blue-950 text-white ring-4 ring-blue-950/15'
                                        : 'border border-gray-300 bg-white text-gray-400'
                                }`}
                            >
                                {hecho ? <CheckIcon size={16} strokeWidth={3} /> : paso.id}
                            </span>
                            <span className="w-24 sm:w-28">
                                <span
                                    className={`block font-display text-xs font-semibold ${
                                        activo || hecho ? 'text-blue-950' : 'text-gray-400'
                                    }`}
                                >
                                    {paso.titulo}
                                </span>
                                <span className="hidden text-[11px] text-gray-400 sm:block">{paso.ayuda}</span>
                            </span>
                        </div>
                        {i < PASOS.length - 1 && (
                            <span
                                aria-hidden="true"
                                className={`mt-4 h-0.5 flex-1 rounded-full transition-colors ${
                                    hecho ? 'bg-blue-950' : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

export default function CrearGrupoWizard() {
    const navigate = useNavigate();
    const wizard = useCrearGrupoWizard();

    const handleConfirm = async () => {
        const success = await wizard.submit();
        if (success) navigate(ROUTES.GRUPOS);
    };

    const programaElegido = wizard.programas.find(
        p => p.id_programa_educativo === wizard.filtros.id_programa_educativo
    );
    const cohorteElegida = wizard.cohortes.find(c => c.value === wizard.filtros.cohorte);

    /* El paso 1 pide ambos campos y el 2 exige cohorte; antes el botón sólo se
       deshabilitaba sin decir por qué. */
    const faltante =
        wizard.step === 1 && !wizard.nombre.trim()
            ? 'Escribe un nombre para el grupo.'
            : wizard.step === 1 && !wizard.descripcion.trim()
            ? 'Agrega una descripción.'
            : wizard.step === 2 && !wizard.filtros.cohorte
            ? 'Elige una cohorte generacional.'
            : null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.GRUPOS)}
                        className="rounded-full p-2 transition-colors hover:bg-gray-200"
                    >
                        <ArrowLeftIcon size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-gray-900">Crear nuevo grupo</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Arma una lista de egresados a partir de su programa y su cohorte.
                        </p>
                    </div>
                </div>

                <Stepper actual={wizard.step} />

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 md:p-8">
                    {wizard.step === 1 && (
                        <div className="space-y-5">
                            <h2 className="font-display text-lg font-medium text-gray-900">Datos del grupo</h2>
                            <div>
                                <label htmlFor="grupo-nombre" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Nombre del grupo
                                </label>
                                <input
                                    id="grupo-nombre"
                                    type="text"
                                    value={wizard.nombre}
                                    onChange={(e) => wizard.setNombre(e.target.value)}
                                    className={inputCls}
                                    placeholder="Ej. Egresados 2025 · Ing. en Software"
                                />
                            </div>
                            <div>
                                <label htmlFor="grupo-desc" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <textarea
                                    id="grupo-desc"
                                    value={wizard.descripcion}
                                    onChange={(e) => wizard.setDescripcion(e.target.value)}
                                    rows={3}
                                    className={inputCls}
                                    placeholder="Para qué se usará este grupo."
                                />
                            </div>
                        </div>
                    )}

                    {wizard.step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="font-display text-lg font-medium text-gray-900">¿A quién incluir?</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Los egresados que cumplan ambos filtros formarán el grupo.
                                </p>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label htmlFor="f-programa" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Programa educativo
                                    </label>
                                    <select
                                        id="f-programa"
                                        value={wizard.filtros.id_programa_educativo || ''}
                                        onChange={(e) => wizard.setFiltros({
                                            ...wizard.filtros,
                                            id_programa_educativo: e.target.value ? Number(e.target.value) : undefined,
                                        })}
                                        className={inputCls}
                                    >
                                        <option value="">Todos los programas</option>
                                        {wizard.programas.map(p => (
                                            <option key={p.id_programa_educativo} value={p.id_programa_educativo}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="f-cohorte" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Cohorte generacional
                                    </label>
                                    <select
                                        id="f-cohorte"
                                        value={wizard.filtros.cohorte ?? ''}
                                        onChange={(e) => wizard.setFiltros({
                                            ...wizard.filtros,
                                            cohorte: e.target.value ? Number(e.target.value) : undefined,
                                        })}
                                        className={inputCls}
                                    >
                                        <option value="">Selecciona una cohorte</option>
                                        {wizard.cohortes.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {wizard.step === 3 && (
                        <div className="space-y-4">
                            <h2 className="font-display text-lg font-medium text-gray-900">Egresados encontrados</h2>
                            {wizard.loadingPreview ? (
                                <div className="flex justify-center py-10">
                                    <LoaderCircleIcon className="size-8 animate-spin text-blue-600" />
                                </div>
                            ) : wizard.totalMatches === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
                                    <UsersIcon className="mx-auto mb-2 size-8 text-gray-300" />
                                    <p className="text-sm font-medium text-gray-700">Ningún egresado coincide</p>
                                    <p className="mt-1 text-sm text-gray-500">Regresa y amplía los filtros.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <UsersRoundIcon className="size-5 shrink-0 text-blue-600" />
                                        <p className="text-sm text-blue-950">
                                            <span className="font-display text-lg font-semibold">{wizard.totalMatches}</span>{' '}
                                            egresados entrarán al grupo.
                                        </p>
                                    </div>
                                    <div className="max-h-96 overflow-auto rounded-xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="sticky top-0 bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Nombre</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Matrícula</th>
                                                    <th className="hidden px-4 py-2.5 text-left text-xs font-semibold text-gray-600 sm:table-cell">Programa</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {wizard.egresadosPreview.map(e => (
                                                    <tr key={e.id_egresado}>
                                                        <td className="px-4 py-2.5 text-sm text-gray-900">{e.nombre} {e.primer_apellido}</td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-500">{e.matricula}</td>
                                                        <td className="hidden px-4 py-2.5 text-sm text-gray-500 sm:table-cell">{e.programa_educativo}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-center text-xs text-gray-400">
                                        Muestra de hasta 20 de los {wizard.totalMatches} egresados.
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {wizard.step === 4 && (
                        <div className="space-y-5">
                            <h2 className="font-display text-lg font-medium text-gray-900">Confirma antes de crear</h2>
                            <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                                {[
                                    ['Nombre', wizard.nombre],
                                    ['Descripción', wizard.descripcion],
                                    ['Programa', programaElegido?.nombre ?? 'Todos los programas'],
                                    ['Cohorte', cohorteElegida?.label ?? '—'],
                                    ['Egresados a importar', String(wizard.totalMatches)],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex gap-4 px-4 py-3">
                                        <dt className="w-44 shrink-0 text-sm text-gray-500">{k}</dt>
                                        <dd className="text-sm font-medium break-words text-gray-900">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <FilterIcon className="mt-0.5 size-4 shrink-0 text-blue-600" />
                                <p className="text-sm text-blue-900/80">
                                    El grupo se crea con esta lista fija. Si después cambian los egresados que
                                    cumplen los filtros, tendrás que actualizar el grupo manualmente.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 border-t border-gray-200 pt-5">
                        {faltante && <p className="mb-3 text-sm text-amber-700">{faltante}</p>}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={wizard.prevStep}
                                disabled={wizard.step === 1 || wizard.isSubmitting}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            {wizard.step < 4 ? (
                                <button
                                    type="button"
                                    onClick={wizard.nextStep}
                                    disabled={!!faltante || (wizard.step === 3 && wizard.totalMatches === 0)}
                                    className="rounded-lg bg-blue-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:bg-gray-300"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={wizard.isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-300"
                                >
                                    {wizard.isSubmitting && <LoaderCircleIcon className="size-4 animate-spin" />}
                                    {wizard.isSubmitting ? 'Importando…' : `Crear grupo con ${wizard.totalMatches}`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
