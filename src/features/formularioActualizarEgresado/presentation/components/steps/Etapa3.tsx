import React from 'react';
import type { FormData } from '../../types';

const SECTORES_ECONOMICOS = [
  { value: '1', label: 'Agricultura y ganaderia' },
  { value: '2', label: 'Comercio' },
  { value: '3', label: 'Comunicaciones y transportes' },
  { value: '4', label: 'Educacion y Inv.' },
  { value: '5', label: 'Gobierno' },
  { value: '6', label: 'Ind.Construccion' },
  { value: '7', label: 'Ind. Transformacion' },
  { value: '8', label: 'Servicios' },
  { value: '9', label: 'Sector privado' },
];

interface EtapaTresProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const EtapaTres: React.FC<EtapaTresProps> = ({ data, onChange, setFormData }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <label className="text-sm font-medium text-blue-900 block mb-2">¿Trabaja Actualmente?</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="trabajaActualmente" 
              checked={data.trabajaActualmente === true} 
              onChange={() => setFormData(prev => ({...prev, trabajaActualmente: true}))} 
              className="accent-blue-900" 
            />
            <span className="text-sm text-gray-600">Sí</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="trabajaActualmente" 
              checked={data.trabajaActualmente === false} 
              onChange={() => setFormData(prev => ({...prev, trabajaActualmente: false}))} 
              className="accent-blue-900" 
            />
            <span className="text-sm text-gray-600">No</span>
          </label>
        </div>
      </div>

      {data.trabajaActualmente && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <label className="text-xs text-blue-900 font-semibold">Nombre de la Empresa</label>
              <input type="text" name="empresa" value={data.empresa} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Puesto Desempeñado</label>
              <input type="text" name="puesto" value={data.puesto} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Sector economico</label>
              <select
                name="sector"
                value={data.sector}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Selecciona un sector</option>
                {SECTORES_ECONOMICOS.map((sector) => (
                  <option key={sector.value} value={sector.value}>
                    {sector.value}. {sector.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Actividad Principal</label>
              <input type="text" name="actividad" value={data.actividad} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
        </div>
      )}
    </div>
  );
};

export default EtapaTres;