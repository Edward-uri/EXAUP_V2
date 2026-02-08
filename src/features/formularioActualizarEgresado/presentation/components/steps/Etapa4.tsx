import React, { useState } from 'react';
import type { FormData } from '../../types';
import type { LogroAcademicoInput, LogroLaboralInput } from '../../../domain/ActualizarEgresado';
import { ActualizarEgresadoService } from '../../../data/ActualizarEgresadoService';

interface EtapaCuatroProps {
  data: FormData;
}

const EtapaCuatro: React.FC<EtapaCuatroProps> = ({ data }) => {
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
  const [logrosAcademicos, setLogrosAcademicos] = useState<LogroAcademicoInput[]>([]);
  const [logrosLaborales, setLogrosLaborales] = useState<LogroLaboralInput[]>([]);
  const [savingAcademico, setSavingAcademico] = useState(false);
  const [savingLaboral, setSavingLaboral] = useState(false);

  const handleGuardarLogroAcademico = async () => {
    if (!data.egresadoId) {
      alert('Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    if (!logroAcademico.titulo || !logroAcademico.institucion || !logroAcademico.fecha) {
      alert('Completa título, institución y fecha del logro académico.');
      return;
    }

    setSavingAcademico(true);
    try {
      await ActualizarEgresadoService.createLogroAcademico(data.egresadoId, logroAcademico);
      setLogrosAcademicos(prev => [...prev, logroAcademico]);
      setLogroAcademico({ titulo: '', institucion: '', fecha: '' });
    } catch (error) {
      console.error('Error al guardar logro académico:', error);
      alert('No se pudo guardar el logro académico.');
    } finally {
      setSavingAcademico(false);
    }
  };

  const handleGuardarLogroLaboral = async () => {
    if (!data.egresadoId) {
      alert('Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    if (!logroLaboral.empresa || !logroLaboral.puesto || !logroLaboral.fecha) {
      alert('Completa empresa, puesto y fecha del logro laboral.');
      return;
    }

    setSavingLaboral(true);
    try {
      await ActualizarEgresadoService.createLogroLaboral(data.egresadoId, logroLaboral);
      setLogrosLaborales(prev => [...prev, logroLaboral]);
      setLogroLaboral({ empresa: '', puesto: '', fecha: '' });
    } catch (error) {
      console.error('Error al guardar logro laboral:', error);
      alert('No se pudo guardar el logro laboral.');
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

            {logrosAcademicos.length > 0 && (
              <div className="mt-4 space-y-2">
                {logrosAcademicos.map((item, index) => (
                  <div key={`${item.titulo}-${index}`} className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-md p-2">
                    <p className="font-semibold text-blue-900">{item.titulo}</p>
                    <p>{item.institucion} · {item.fecha}</p>
                  </div>
                ))}
              </div>
            )}
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

            {logrosLaborales.length > 0 && (
              <div className="mt-4 space-y-2">
                {logrosLaborales.map((item, index) => (
                  <div key={`${item.empresa}-${index}`} className="text-xs text-gray-600 bg-emerald-50 border border-emerald-100 rounded-md p-2">
                    <p className="font-semibold text-emerald-900">{item.empresa}</p>
                    <p>{item.puesto} · {item.fecha}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default EtapaCuatro;