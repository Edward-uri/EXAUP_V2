import React, { useEffect, useState } from 'react';
import type { FormData } from '../../types';
import type { LogroAcademicoInput, LogroLaboralInput } from '../../../domain/ActualizarEgresado';
import { ActualizarEgresadoService } from '../../../data/ActualizarEgresadoService';
import { useAlert } from '../../../../../shared/components/Alert';
import { GraduationCap, Briefcase, PlusCircle, CheckCircle2 } from 'lucide-react';

interface EtapaCuatroProps {
  data: FormData;
}

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

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
      alert.warning('Logro existente', 'Solo puedes registrar un logro académico principal por ahora.');
      return;
    }

    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu identidad (CURP).');
      return;
    }

    if (!logroAcademico.titulo || !logroAcademico.institucion || !logroAcademico.fecha) {
      alert.warning('Datos incompletos', 'Completa los campos del logro académico.');
      return;
    }

    setSavingAcademico(true);
    try {
      await ActualizarEgresadoService.createLogroAcademico(data.egresadoId, logroAcademico);
      setHasLogroAcademico(true);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert.error('Error', 'No se pudo guardar el logro académico.');
    } finally {
      setSavingAcademico(false);
    }
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSinopsisChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value;
    const words = countWords(value);
    if (words <= 100) {
      setSinopsis(value);
    } else {
      const limited = value.trim().split(/\s+/).slice(0, 100).join(' ');
      setSinopsis(limited);
    }
  };

  const handleGuardarSinopsis = async () => {
    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu identidad.');
      return;
    }

    const words = countWords(sinopsis);
    if (words === 0) {
      alert.warning('Sinopsis vacía', 'Escribe una breve descripción de tu perfil.');
      return;
    }

    if (words > 100) {
      alert.warning('Límite excedido', 'La sinopsis debe tener máximo 100 palabras.');
      return;
    }

    setSavingSinopsis(true);
    try {
      await ActualizarEgresadoService.updateSinopsis(data.egresadoId, sinopsis.trim());
      alert.success('Sinopsis guardada', 'Tu resumen profesional se actualizó correctamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert.error('Error', 'No se pudo guardar la sinopsis.');
    } finally {
      setSavingSinopsis(false);
    }
  };

  const handleGuardarLogroLaboral = async () => {
    if (hasLogroLaboral) {
      alert.warning('Logro existente', 'Solo puedes registrar un logro laboral principal por ahora.');
      return;
    }

    if (!data.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu identidad.');
      return;
    }

    if (!logroLaboral.empresa || !logroLaboral.puesto || !logroLaboral.fecha) {
      alert.warning('Datos incompletos', 'Completa los campos del logro laboral.');
      return;
    }

    setSavingLaboral(true);
    try {
      await ActualizarEgresadoService.createLogroLaboral(data.egresadoId, logroLaboral);
      setHasLogroLaboral(true);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert.error('Error', 'No se pudo guardar el logro laboral.');
    } finally {
      setSavingLaboral(false);
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-800 font-display tracking-tight">
            Destaca en Orgullo UP
          </h3>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Comparte tus mayores logros y tu perfil profesional para conectar e inspirar a la comunidad universitaria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Logro Académico */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-blue-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <GraduationCap size={20} strokeWidth={2.5} />
                </div>
                <h4 className="text-base font-bold text-slate-800">Logro Académico Relevante</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Título / Posgrado / Reconocimiento</label>
                  <input
                    type="text"
                    value={logroAcademico.titulo}
                    onChange={(e) => setLogroAcademico(prev => ({ ...prev, titulo: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej. Maestría en IA"
                    disabled={hasLogroAcademico}
                  />
                </div>
                <div>
                  <label className={labelClass}>Institución que lo otorga</label>
                  <input
                    type="text"
                    value={logroAcademico.institucion}
                    onChange={(e) => setLogroAcademico(prev => ({ ...prev, institucion: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej. Universidad Politécnica"
                    disabled={hasLogroAcademico}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha de Obtención</label>
                  <input
                    type="date"
                    value={logroAcademico.fecha}
                    onChange={(e) => setLogroAcademico(prev => ({ ...prev, fecha: e.target.value }))}
                    className={inputClass}
                    disabled={hasLogroAcademico}
                  />
                </div>
                
                {hasLogroAcademico ? (
                   <div className="mt-4 flex items-center justify-center p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100">
                     <CheckCircle2 size={18} className="mr-2" /> Logro Registrado
                   </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGuardarLogroAcademico}
                    disabled={savingAcademico}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {savingAcademico ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><PlusCircle size={18}/> Guardar Logro</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card Logro Laboral */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-blue-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Briefcase size={20} strokeWidth={2.5} />
                </div>
                <h4 className="text-base font-bold text-slate-800">Logro Laboral Relevante</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Empresa / Organización</label>
                  <input
                    type="text"
                    value={logroLaboral.empresa}
                    onChange={(e) => setLogroLaboral(prev => ({ ...prev, empresa: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej. Google"
                    disabled={hasLogroLaboral}
                  />
                </div>
                <div>
                  <label className={labelClass}>Puesto o Rol Destacado</label>
                  <input
                    type="text"
                    value={logroLaboral.puesto}
                    onChange={(e) => setLogroLaboral(prev => ({ ...prev, puesto: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej. Senior Developer"
                    disabled={hasLogroLaboral}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha de Nombramiento</label>
                  <input
                    type="date"
                    value={logroLaboral.fecha}
                    onChange={(e) => setLogroLaboral(prev => ({ ...prev, fecha: e.target.value }))}
                    className={inputClass}
                    disabled={hasLogroLaboral}
                  />
                </div>
                
                {hasLogroLaboral ? (
                   <div className="mt-4 flex items-center justify-center p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100">
                     <CheckCircle2 size={18} className="mr-2" /> Logro Registrado
                   </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGuardarLogroLaboral}
                    disabled={savingLaboral}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {savingLaboral ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><PlusCircle size={18}/> Guardar Logro</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Sinopsis Profesional */}
        <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-blue-900/5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-800">Biografía Profesional (Sinopsis)</h4>
              <p className="text-sm text-slate-500 mt-1">
                Un resumen atractivo de quién eres profesionalmente. Máximo 100 palabras.
              </p>
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full ${countWords(sinopsis) > 90 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
              {countWords(sinopsis)} / 100
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={sinopsis}
              onChange={handleSinopsisChange}
              rows={4}
              className={`${inputClass} resize-none text-base leading-relaxed`}
              placeholder="Ej. Soy un profesional apasionado por el desarrollo de software..."
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleGuardarSinopsis}
              disabled={savingSinopsis || countWords(sinopsis) === 0}
              className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg disabled:hover:shadow-md"
            >
              {savingSinopsis ? 'Guardando...' : 'Actualizar Biografía'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default EtapaCuatro;