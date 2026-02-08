import React, { useRef } from 'react';
import { Calendar, Search, Upload, ImageIcon } from 'lucide-react';
import type { FormData } from '../../../../../types';

interface EtapaUnoProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  curpValidated: boolean;
  onValidateCurp: () => void;
  loadingCurp: boolean;
  setCurpValidated: (val: boolean) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  centerCurp?: boolean;
}

const EtapaUno: React.FC<EtapaUnoProps> = ({ 
  data, 
  onChange, 
  curpValidated, 
  onValidateCurp, 
  loadingCurp, 
  setCurpValidated,
  onImageUpload,
  centerCurp = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 space-y-4">
        <div>
          <label className={`block text-sm font-medium text-blue-900 mb-1 ${centerCurp ? 'text-2xl md:text-3xl text-center font-bold' : ''}`}>
            Matrícula
          </label>
          <input
            type="text"
            name="matricula"
            value={data.matricula}
            onChange={onChange}
            disabled={curpValidated}
            placeholder="Ingresa tu matrícula..."
            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none ${centerCurp ? 'max-w-md mx-auto block' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-blue-900 mb-1 ${centerCurp ? 'text-2xl md:text-3xl text-center font-bold' : ''}`}>
            CURP
          </label>
          <input 
            type="text" 
            name="curp" 
            value={data.curp} 
            onChange={onChange} 
            disabled={curpValidated} 
            placeholder="Ingresa tu CURP..." 
            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none uppercase ${centerCurp ? 'max-w-md mx-auto block' : ''}`} 
          />
        </div>

        <div className={`${centerCurp ? 'flex justify-center' : ''} mt-3 mb-2`}>
          {!curpValidated ? (
            <button 
              onClick={onValidateCurp} 
              disabled={loadingCurp} 
              className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
            >
              {loadingCurp ? 'Buscando...' : 'Validar'} <Search size={16}/>
            </button>
          ) : null}
        </div>
      </div>

      {curpValidated && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sección de foto */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors overflow-hidden relative group bg-white"
            >
              {data.orgulloImagen ? (
                <img src={data.orgulloImagen} alt="Foto Perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-blue-400">
                  <ImageIcon size={32} />
                  <span className="text-xs mt-2 text-center">Subir Foto</span>
                </div>
              )}
              {/* Overlay al hacer hover */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImageUpload} 
              className="hidden" 
              accept="image/*"
            />
            <p className="text-xs text-gray-500 mt-3 text-center">Haz clic para subir tu foto de perfil</p>
          </div>

          {/* Campos de texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-blue-900 font-semibold">Nombre</label>
              <input type="text" name="nombre" value={data.nombre} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            
            <div>
              <label className="text-xs text-blue-900 font-semibold">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={data.fechaNacimiento}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-blue-900 font-semibold">Apellido Paterno</label>
              <input type="text" name="apellidoPaterno" value={data.apellidoPaterno} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>

            <div>
              <label className="text-xs text-blue-900 font-semibold">Apellido Materno</label>
              <input type="text" name="apellidoMaterno" value={data.apellidoMaterno} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-blue-900 font-semibold">Correo Electrónico</label>
              <input type="email" name="email" value={data.email} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtapaUno;