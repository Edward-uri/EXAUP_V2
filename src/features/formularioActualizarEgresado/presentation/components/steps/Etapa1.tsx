import React, { useRef } from 'react';
import { Search, Upload, ImageIcon, CheckCircle2 } from 'lucide-react';
import type { FormData } from '../../types';

interface EtapaUnoProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  curpValidated: boolean;
  onValidateCurp: () => void;
  loadingCurp: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  centerCurp?: boolean;
  isUploadingImage?: boolean;
}

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

const EtapaUno: React.FC<EtapaUnoProps> = ({ 
  data, 
  onChange, 
  curpValidated, 
  onValidateCurp, 
  loadingCurp, 
  onImageUpload,
  centerCurp = false,
  isUploadingImage = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="animate-fade-in-up w-full max-w-3xl mx-auto">
      <div className={`mb-8 space-y-4 transition-all duration-500 ${curpValidated ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
        <div className="relative">
          <label className={`${labelClass} ${centerCurp ? 'text-center' : ''}`}>
            Valida tu identidad (CURP)
          </label>
          <div className={`flex gap-3 ${centerCurp ? 'justify-center max-w-md mx-auto' : ''}`}>
            <input 
              type="text" 
              name="curp" 
              value={data.curp} 
              onChange={onChange} 
              disabled={curpValidated} 
              placeholder="Ingresa tu CURP de 18 caracteres..." 
              className={`${inputClass} uppercase tracking-widest font-medium shadow-sm ${curpValidated ? 'bg-slate-100 text-slate-500' : ''}`} 
            />
            {!curpValidated ? (
              <button 
                onClick={onValidateCurp} 
                disabled={loadingCurp || data.curp.length < 18} 
                className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2 font-medium"
              >
                {loadingCurp ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Search size={18}/> Validar</>
                )}
              </button>
            ) : (
               <div className="flex items-center justify-center px-6 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                  <CheckCircle2 size={20} className="mr-2" />
                  <span className="font-bold text-sm">Validado</span>
               </div>
            )}
          </div>
        </div>
      </div>

      {curpValidated && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          
          <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 shrink-0 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden relative group"
            >
              {data.orgulloImagen ? (
                <img src={data.orgulloImagen} alt="Foto Perfil" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <ImageIcon size={28} strokeWidth={1.5} />
                </div>
              )}
              <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Upload className="text-white" size={24} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImageUpload} 
              className="hidden" 
              accept="image/*"
              disabled={isUploadingImage}
            />
            <div>
              <h3 className="text-lg font-bold text-slate-800">Fotografía de perfil</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {isUploadingImage ? 'Procesando imagen...' : 'Sube una fotografía profesional. Se utilizará para tu perfil dentro de la plataforma Orgullo UP.'}
              </p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
              >
                Explorar archivos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelClass}>Nombre(s)</label>
              <input type="text" name="nombre" value={data.nombre} onChange={onChange} className={inputClass} placeholder="Ej. Juan" />
            </div>
            
            <div>
              <label className={labelClass}>Fecha de Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={onChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Apellido Paterno</label>
              <input type="text" name="apellidoPaterno" value={data.apellidoPaterno} onChange={onChange} className={inputClass} placeholder="Ej. Pérez" />
            </div>

            <div>
              <label className={labelClass}>Apellido Materno</label>
              <input type="text" name="apellidoMaterno" value={data.apellidoMaterno} onChange={onChange} className={inputClass} placeholder="Ej. Gómez" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className={labelClass}>Correo Electrónico de Contacto</label>
              <input type="email" name="email" value={data.email} onChange={onChange} className={inputClass} placeholder="correo@ejemplo.com" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtapaUno;