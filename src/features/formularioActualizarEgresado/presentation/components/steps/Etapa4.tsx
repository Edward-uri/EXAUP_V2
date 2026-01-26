import React from 'react';
import { Heart } from 'lucide-react';
import type { FormData } from '../../types';

interface EtapaCuatroProps {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EtapaCuatro: React.FC<EtapaCuatroProps> = ({ data, onChange, onImageUpload }) => {
  return (
    <div className="animate-fade-in-up">
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Heart className="fill-blue-900 text-blue-900" size={24} /> Únete a Orgullo UP
        </h3>
        <p className="text-sm text-gray-500 mb-6">
            Comparte tu trayectoria profesional y conecta con la comunidad de egresados.
        </p>

        <div className="space-y-4">
            <div>
              <label className="text-xs text-blue-900 font-semibold">Nombre Público</label>
              <input type="text" name="orgulloNombre" value={data.orgulloNombre} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" placeholder="Como quieres aparecer en la comunidad..." />
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Carrera de Egreso</label>
              <input type="text" name="orgulloCarrera" value={data.orgulloCarrera} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Correo de Contacto (Público)</label>
              <input type="email" name="orgulloCorreo" value={data.orgulloCorreo} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            <div>
              <label className="text-xs text-blue-900 font-semibold">Mensaje / ¿A qué te dedicas?</label>
              <textarea name="orgulloMensaje" value={data.orgulloMensaje} onChange={onChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md mt-1 resize-none" placeholder="Cuéntanos un poco sobre ti..." />
            </div>
        </div>
    </div>
  );
};

export default EtapaCuatro;