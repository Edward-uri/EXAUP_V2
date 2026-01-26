import React from 'react';
import type { FormData } from '../../types';

interface EtapaDosProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EtapaDos: React.FC<EtapaDosProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-blue-900 font-semibold">Calle</label>
        <input type="text" name="calle" value={data.calle} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-blue-900 font-semibold">Colonia</label>
        <input type="text" name="colonia" value={data.colonia} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
      <div>
        <label className="text-xs text-blue-900 font-semibold">Número Exterior</label>
        <input type="text" name="numero" value={data.numero} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
      <div>
        <label className="text-xs text-blue-900 font-semibold">Código Postal</label>
        <input type="text" name="codigoPostal" value={data.codigoPostal} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
      <div>
        <label className="text-xs text-blue-900 font-semibold">Estado</label>
        <input type="text" name="estado" value={data.estado} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
      <div>
        <label className="text-xs text-blue-900 font-semibold">Ciudad</label>
        <input type="text" name="ciudad" value={data.ciudad} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
      </div>
    </div>
  );
};

export default EtapaDos;