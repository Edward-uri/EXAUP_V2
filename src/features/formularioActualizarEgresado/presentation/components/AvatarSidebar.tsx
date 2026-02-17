import React from 'react';

interface AvatarSidebarProps {
  imagePreview: string | null;
}

const AvatarSidebar: React.FC<AvatarSidebarProps> = ({ imagePreview }) => {
  console.log('[AvatarSidebar] Render con imagePreview =', imagePreview);
  return (
    <div className="w-full md:w-1/3 bg-white p-8 flex flex-col items-center border-r border-gray-100 pt-12">
      <div className="w-40 h-40 rounded-full border-2 border-blue-300 flex items-center justify-center overflow-hidden bg-white shadow-md">
        {imagePreview ? (
          <img src={imagePreview} alt="Foto Perfil" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center text-gray-400">
            <span className="text-sm">Sin foto</span>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        {imagePreview ? 'Tu Foto de Perfil' : 'Foto de Perfil'}
      </p>
    </div>
  );
};

export default AvatarSidebar;