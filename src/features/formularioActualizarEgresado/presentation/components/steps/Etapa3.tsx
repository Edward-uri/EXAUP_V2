import React from 'react';
import type { FormData } from '../../types';

interface EtapaTresProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  // Para actualizar el booleano 'trabajaActualmente'
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
              <label className="text-xs text-blue-900 font-semibold">Sector Económico</label>
              <select name="sector" onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white">
                    <option value="">Seleccione...</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Salud">Salud</option>
                    <option value="Educación">Educación</option>
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