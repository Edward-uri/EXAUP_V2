import React, { useEffect, useState } from 'react';
import type { FormData } from '../../types';
import type { LogroAcademicoInput, LogroLaboralInput } from '../../../domain/ActualizarEgresado';
import { ActualizarEgresadoService } from '../../../data/ActualizarEgresadoService';
import { useAlert } from '../../../../../shared/components/Alert';

interface EtapaCuatroProps {
  data: FormData;
}

const EtapaCuatro: React.FC<EtapaCuatroProps> = ({ data }) => {
  const alert = useAlert();
  const [logroAcademico, setLogroAcademico] = useState<LogroAcademicoInput>({
    titulo: '',
    institucion: '',
    fecha: ''
  });
  const [logroLaboral, setLogroLaboral] = useState<LogroLaboralInput>({
    empresa: '',
    puesto: '',
    fecha: ''
  });
  const [savingAcademico, setSavingAcademico] = useState(false);
  const [savingLaboral, setSavingLaboral] = useState(false);
  const [hasLogroAcademico, setHasLogroAcademico] = useState(false);
  const [hasLogroLaboral, setHasLogroLaboral] = useState(false);
  const [sinopsis, setSinopsis] = useState<string>("");
  const [savingSinopsis, setSavingSinopsis] = useState(false);

  const normalizeDateToYMD = (value?: string | null): string => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      if (value.includes("T")) {
        const [ymd] = value.split("T");
        if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
          return ymd;
        }
      }
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadLogros = async () => {
      if (!data.egresadoId) return;

      try {
        const [academicos, laborales, sinopsisExistente] = await Promise.all([
          ActualizarEgresadoService.getLogrosAcademicos(data.egresadoId),
          ActualizarEgresadoService.getLogrosLaborales(data.egresadoId),
          ActualizarEgresadoService.getSinopsis(data.egresadoId),
        ]);

        const mappedAcademicos: LogroAcademicoInput[] = (academicos || []).map((item: any) => ({
          titulo: item.attributes?.titulo ?? '',
          institucion: item.attributes?.institucion ?? '',
          fecha: normalizeDateToYMD(item.attributes?.fecha),
        }));

        const mappedLaborales: LogroLaboralInput[] = (laborales || []).map((item: any) => ({
          empresa: item.attributes?.empresa ?? '',
          puesto: item.attributes?.puesto ?? '',
          fecha: normalizeDateToYMD(item.attributes?.fecha),
        }));

        if (mappedAcademicos.length > 0) {
          setLogroAcademico(mappedAcademicos[0]);
          setHasLogroAcademico(true);
        }

        if (mappedLaborales.length > 0) {
          setLogroLaboral(mappedLaborales[0]);
          setHasLogroLaboral(true);
        }

        if (sinopsisExistente) {
          setSinopsis(sinopsisExistente);
        }
      } catch (error) {
        console.error('Error al cargar logros del egresado:', error);
      }
    };

    loadLogros();
  }, [data.egresadoId]);

  const handleGuardarLogroAcademico = async () => {
    if (hasLogroAcademico) {
      alert.warning('Ya registraste un logro académico', 'Solo puedes registrar un logro académico.');
      return;
    }

    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    if (!logroAcademico.titulo || !logroAcademico.institucion || !logroAcademico.fecha) {
      alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
      return;
    }

    setSavingAcademico(true);
    try {
      await ActualizarEgresadoService.createLogroAcademico(data.egresadoId, logroAcademico);
      setHasLogroAcademico(true);
    } catch (error) {
      console.error('Error al guardar logro académico:', error);
      alert.error('Error al guardar', 'No se pudo guardar el logro academico.');
    } finally {
      setSavingAcademico(false);
    }
  };

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  };

  const handleSinopsisChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value;
    const words = countWords(value);
    if (words <= 100) {
      setSinopsis(value);
    } else {
      // Si se pasa de 100 palabras, recortar al límite
      const limited = value
        .trim()
        .split(/\s+/)
        .slice(0, 100)
        .join(' ');
      setSinopsis(limited);
    }
  };

  const handleGuardarSinopsis = async () => {
    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    const words = countWords(sinopsis);
    if (words === 0) {
      alert.warning('Sinopsis vacía', 'Por favor escribe una breve sinopsis de tu perfil profesional.');
      return;
    }

    if (words > 100) {
      alert.warning('Límite de palabras', 'La sinopsis debe tener máximo 100 palabras.');
      return;
    }

    setSavingSinopsis(true);
    try {
      await ActualizarEgresadoService.updateSinopsis(data.egresadoId, sinopsis.trim());
      alert.success('Sinopsis guardada', 'Tu sinopsis profesional se actualizó correctamente.');
    } catch (error) {
      console.error('Error al guardar sinopsis:', error);
      alert.error('Error al guardar', 'No se pudo guardar la sinopsis. Intenta nuevamente.');
    } finally {
      setSavingSinopsis(false);
    }
  };

  const handleGuardarLogroLaboral = async () => {
    if (hasLogroLaboral) {
      alert.warning('Ya registraste un logro laboral', 'Solo puedes registrar un logro laboral.');
      return;
    }

    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    if (!logroLaboral.empresa || !logroLaboral.puesto || !logroLaboral.fecha) {
      alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
      return;
    }

    setSavingLaboral(true);
    try {
      await ActualizarEgresadoService.createLogroLaboral(data.egresadoId, logroLaboral);
      setHasLogroLaboral(true);
    } catch (error) {
      console.error('Error al guardar logro laboral:', error);
      alert.error('Error al guardar', 'No se pudo guardar el logro laboral.');
    } finally {
      setSavingLaboral(false);
    }
  };
  return (
    <div className="animate-fade-in-up">
        <h3 className="text-xl font-bold text-blue-900 mb-4">
          Únete a Orgullo UP
        </h3>
        <p className="text-sm text-gray-500 mb-6">
            Comparte tu trayectoria profesional y conecta con la comunidad de egresados.
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-3">Logros Académicos</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-blue-900 font-semibold">Título</label>
                <input
                  type="text"
                  value={logroAcademico.titulo}
                  onChange={(e) => setLogroAcademico(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-blue-900 font-semibold">Institución</label>
                <input
                  type="text"
                  value={logroAcademico.institucion}
                  onChange={(e) => setLogroAcademico(prev => ({ ...prev, institucion: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-blue-900 font-semibold">Fecha</label>
                <input
                  type="date"
                  value={logroAcademico.fecha}
                  onChange={(e) => setLogroAcademico(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <button
                type="button"
                onClick={handleGuardarLogroAcademico}
                disabled={savingAcademico}
                className="w-full mt-2 bg-blue-100 text-blue-900 py-2 rounded-md font-semibold hover:bg-blue-200 border border-blue-200 disabled:opacity-50"
              >
                {savingAcademico ? 'Guardando...' : 'Guardar logro académico'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-3">Logros Laborales</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-blue-900 font-semibold">Empresa</label>
                <input
                  type="text"
                  value={logroLaboral.empresa}
                  onChange={(e) => setLogroLaboral(prev => ({ ...prev, empresa: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-blue-900 font-semibold">Puesto</label>
                <input
                  type="text"
                  value={logroLaboral.puesto}
                  onChange={(e) => setLogroLaboral(prev => ({ ...prev, puesto: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-blue-900 font-semibold">Fecha</label>
                <input
                  type="date"
                  value={logroLaboral.fecha}
                  onChange={(e) => setLogroLaboral(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <button
                type="button"
                onClick={handleGuardarLogroLaboral}
                disabled={savingLaboral}
                className="w-full mt-2 bg-emerald-100 text-emerald-900 py-2 rounded-md font-semibold hover:bg-emerald-200 border border-emerald-200 disabled:opacity-50"
              >
                {savingLaboral ? 'Guardando...' : 'Guardar logro laboral'}
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Sinopsis Profesional */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-bold text-blue-900 mb-3">Sinopsis profesional</h4>
          <p className="text-xs text-gray-500 mb-3">
            Escribe un breve resumen (máximo 100 palabras) sobre tu perfil profesional. Esta sinopsis se utilizará en tu perfil y en las interfaces de logros.
          </p>
          <textarea
            value={sinopsis}
            onChange={handleSinopsisChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ejemplo: Profesional con experiencia en..."
          />
          <div className="mt-2 flex items-center justify-end text-xs text-gray-500">
            <span>{countWords(sinopsis)} / 100 palabras</span>
          </div>
          <button
            type="button"
            onClick={handleGuardarSinopsis}
            disabled={savingSinopsis}
            className="w-full mt-2 bg-blue-100 text-blue-900 py-2 rounded-md font-semibold hover:bg-blue-200 border border-blue-200 disabled:opacity-50"
          >
            {savingSinopsis ? 'Guardando...' : 'Guardar sinopsis'}
          </button>
        </div>
    </div>
  );
};

export default EtapaCuatro;