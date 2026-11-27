import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Formulario } from '../../../formulario/domain/Formulario';

interface FormularioComboboxProps {
    formularios: Formulario[];
    value: string;
    onChange: (id: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
    hasError?: boolean;
}

// Sin acentos ni mayúsculas, para que "evaluacion" encuentre "Evaluación"
const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * F7: selector de formulario con buscador.
 * Se escribe parte del título y la lista se reduce.
 */
export function FormularioCombobox({ formularios, value, onChange, onBlur, disabled, hasError }: FormularioComboboxProps) {
    const [texto, setTexto] = useState('');
    const [abierto, setAbierto] = useState(false);

    const seleccionado = formularios.find(f => f.id === value);

    const filtrados = useMemo(() => {
        const t = normalizar(texto.trim());
        return t ? formularios.filter(f => normalizar(f.attributes.titulo).includes(t)) : formularios;
    }, [texto, formularios]);

    // Se usa en onMouseDown para que el clic llegue antes de que el campo pierda el foco
    const elegir = (e: React.MouseEvent, f: Formulario) => {
        e.preventDefault();
        onChange(f.id);
        setTexto('');
        setAbierto(false);
    };

    return (
        <div className="relative min-w-0 flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                role="combobox"
                aria-expanded={abierto}
                aria-controls="lista-formularios"
                value={abierto ? texto : (seleccionado?.attributes.titulo ?? texto)}
                onChange={(e) => {
                    setTexto(e.target.value);
                    setAbierto(true);
                    if (value) onChange('');
                }}
                onFocus={() => setAbierto(true)}
                onBlur={() => {
                    setAbierto(false);
                    onBlur?.();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') setAbierto(false);
                }}
                disabled={disabled}
                placeholder="Escribe para buscar un formulario..."
                className={`block w-full rounded-lg border-0 py-2.5 pl-9 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${hasError ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all`}
            />
            {abierto && !disabled && (
                <ul
                    id="lista-formularios"
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-gray-900/10"
                >
                    {filtrados.length === 0 ? (
                        <li className="px-3 py-2 text-gray-500">Sin resultados</li>
                    ) : (
                        filtrados.map(f => (
                            <li
                                key={f.id}
                                role="option"
                                aria-selected={f.id === value}
                                onMouseDown={(e) => elegir(e, f)}
                                className={`cursor-pointer px-3 py-2 hover:bg-blue-50 ${f.id === value ? 'bg-blue-50 font-medium text-blue-900' : 'text-gray-900'}`}
                            >
                                {f.attributes.titulo}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}