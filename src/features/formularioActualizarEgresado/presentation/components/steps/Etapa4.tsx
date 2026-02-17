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

  useEffect(() => {
    const loadLogros = async () => {
      if (!data.egresadoId) return;

      try {
        const [academicos, laborales] = await Promise.all([
		  ActualizarEgresadoService.getLogrosAcademicos(data.egresadoId),
		  ActualizarEgresadoService.getLogrosLaborales(data.egresadoId),
		]);

        const mappedAcademicos: LogroAcademicoInput[] = (academicos || []).map((item: any) => ({
          titulo: item.attributes?.titulo ?? '',
          institucion: item.attributes?.institucion ?? '',
          fecha: item.attributes?.fecha ?? '',
        }));

        const mappedLaborales: LogroLaboralInput[] = (laborales || []).map((item: any) => ({
          empresa: item.attributes?.empresa ?? '',
          puesto: item.attributes?.puesto ?? '',
          fecha: item.attributes?.fecha ?? '',
        }));

        if (mappedAcademicos.length > 0) {
          setLogroAcademico(mappedAcademicos[0]);
          setHasLogroAcademico(true);
        }

        if (mappedLaborales.length > 0) {
          setLogroLaboral(mappedLaborales[0]);
          setHasLogroLaboral(true);
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
    </div>
  );
};

export default EtapaCuatro;