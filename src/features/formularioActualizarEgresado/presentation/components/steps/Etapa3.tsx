import React from 'react';
import type { FormData } from '../../types';

const SECTORES_ECONOMICOS = [
  { value: '1', label: 'Agricultura y ganadería' },
  { value: '2', label: 'Comercio' },
  { value: '3', label: 'Comunicaciones y transportes' },
  { value: '4', label: 'Educación e Investigación' },
  { value: '5', label: 'Gobierno' },
  { value: '6', label: 'Ind. de la Construcción' },
  { value: '7', label: 'Ind. de Transformación' },
  { value: '8', label: 'Servicios' },
  { value: '9', label: 'Sector privado' },
];

interface EtapaTresProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

const EtapaTres: React.FC<EtapaTresProps> = ({ data, onChange, setFormData }) => {
  return (
    <div className="animate-fade-in-up w-full max-w-3xl mx-auto space-y-8">
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Situación Laboral</h3>
        
        <div className="mb-8">
          <label className={labelClass}>¿Trabajas Actualmente?</label>
          <div className="flex gap-4 mt-3">
            <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 rounded-xl py-3 transition-all duration-200 font-medium
              ${data.trabajaActualmente === true ? 'border-blue-600 bg-blue-50/50 text-blue-800 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <input 
                type="radio" 
                name="trabajaActualmente" 
                checked={data.trabajaActualmente === true} 
                onChange={() => setFormData(prev => ({...prev, trabajaActualmente: true}))} 
                className="hidden" 
              />
              Sí, trabajo actualmente
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 rounded-xl py-3 transition-all duration-200 font-medium
              ${data.trabajaActualmente === false ? 'border-blue-600 bg-blue-50/50 text-blue-800 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <input 
                type="radio" 
                name="trabajaActualmente" 
                checked={data.trabajaActualmente === false} 
                onChange={() => setFormData(prev => ({...prev, trabajaActualmente: false}))} 
                className="hidden" 
              />
              No trabajo
            </label>
          </div>
        </div>

        {data.trabajaActualmente && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              <div className="col-span-1 md:col-span-2">
                <label className={labelClass}>Nombre de la Empresa u Organización</label>
                <input type="text" name="empresa" value={data.empresa} onChange={onChange} className={inputClass} placeholder="Ej. Microsoft" />
              </div>
              
              <div>
                <label className={labelClass}>Puesto Desempeñado</label>
                <input type="text" name="puesto" value={data.puesto} onChange={onChange} className={inputClass} placeholder="Ej. Ingeniero de Software" />
              </div>
              
              <div>
                <label className={labelClass}>Sector Económico</label>
                <select
                  name="sector"
                  value={data.sector}
                  onChange={onChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Selecciona un sector...</option>
                  {SECTORES_ECONOMICOS.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className={labelClass}>Actividad Principal (Breve)</label>
                <input type="text" name="actividad" value={data.actividad} onChange={onChange} className={inputClass} placeholder="Ej. Desarrollo de aplicaciones web" />
              </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EtapaTres;