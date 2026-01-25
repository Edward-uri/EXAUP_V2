import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface TemplatePreviewProps {
    htmlContent: string;
    subject: string;
}

export const TemplatePreview = ({ htmlContent, subject }: TemplatePreviewProps) => {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Si no hay contenido, mostramos un estado vacío
    if (!htmlContent) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <ComputerDesktopIcon className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Selecciona una plantilla para ver la vista previa</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar del Preview */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vista Previa</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Vista Desktop"
                    >
                        <ComputerDesktopIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Vista Móvil"
                    >
                        <DevicePhoneMobileIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Contenedor del Preview (Simula cliente de correo) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1">
                {/* Header falso de correo */}
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Asunto:</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{subject}</p>
                </div>

                {/* Área del Iframe */}
                <div className={`flex-1 bg-white relative transition-all duration-300 mx-auto ${viewMode === 'mobile' ? 'w-[375px]' : 'w-full'}`}>
                    <iframe
                        srcDoc={htmlContent}
                        title="Email Preview"
                        className="w-full h-full border-none"
                        sandbox="allow-same-origin" // Seguridad
                    />
                </div>
            </div>
        </div>
    );
};