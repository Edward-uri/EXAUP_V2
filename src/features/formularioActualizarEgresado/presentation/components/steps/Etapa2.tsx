import React from 'react';
import type { FormData } from '../../types';

interface EtapaDosProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

const EtapaDos: React.FC<EtapaDosProps> = ({ data, onChange }) => {
  return (
    <div className="animate-fade-in-up w-full max-w-3xl mx-auto space-y-8">
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Dirección de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-1 md:col-span-2">
            <label className={labelClass}>Calle</label>
            <input type="text" name="calle" value={data.calle} onChange={onChange} className={inputClass} placeholder="Ej. Av. Central" />
          </div>

          <div>
            <label className={labelClass}>Número Exterior / Interior</label>
            <input type="text" name="numero" value={data.numero} onChange={onChange} className={inputClass} placeholder="Ej. 123 Int. 4" />
          </div>

          <div>
            <label className={labelClass}>Código Postal</label>
            <input type="text" name="codigoPostal" value={data.codigoPostal} onChange={onChange} className={inputClass} placeholder="Ej. 29000" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className={labelClass}>Colonia / Fraccionamiento</label>
            <input type="text" name="colonia" value={data.colonia} onChange={onChange} className={inputClass} placeholder="Ej. Centro" />
          </div>

          <div>
            <label className={labelClass}>Ciudad / Municipio</label>
            <input type="text" name="ciudad" value={data.ciudad} onChange={onChange} className={inputClass} placeholder="Ej. Tuxtla Gutiérrez" />
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <input type="text" name="estado" value={data.estado} onChange={onChange} className={inputClass} placeholder="Ej. Chiapas" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default EtapaDos;