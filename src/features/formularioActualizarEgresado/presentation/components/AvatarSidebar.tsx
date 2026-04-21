import React from 'react';

interface AvatarSidebarProps {
  imagePreview: string | null;
}

const AvatarSidebar: React.FC<AvatarSidebarProps> = ({ imagePreview }) => {
  return (
    <div className="hidden md:flex w-1/3 bg-slate-50/50 p-8 flex-col items-center border-r border-gray-100 pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
      
      <div className="relative z-10 group">
        <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
        <div className="w-48 h-48 rounded-full border-4 border-white flex items-center justify-center overflow-hidden bg-white shadow-xl relative z-10">
          {imagePreview ? (
            <img src={imagePreview} alt="Foto Perfil" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider">Sin foto</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center z-10">
        <h3 className="text-lg font-bold text-slate-800 font-display">Tu Perfil</h3>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
          Orgullo UP
        </p>
      </div>
    </div>
  );
};

export default AvatarSidebar;