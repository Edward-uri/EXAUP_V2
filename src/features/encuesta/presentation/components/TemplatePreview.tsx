import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface TemplatePreviewProps {
    htmlContent: string;
    subject: string;
}

export const TemplatePreview = ({ htmlContent, subject }: TemplatePreviewProps) => {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState('600px');

    // Ajustar altura del iframe automáticamente cuando carga el contenido
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const adjustHeight = () => {
            try {
                const iframeDoc = iframe.contentWindow?.document;
                if (iframeDoc && iframeDoc.body) {
                    // Calcular altura real del contenido
                    const contentHeight = Math.max(
                        iframeDoc.body.scrollHeight,
                        iframeDoc.documentElement.scrollHeight,
                        600 // Altura mínima
                    );
                    setIframeHeight(`${contentHeight}px`);
                }
            } catch (error) {
                // Error de cross-origin, usar altura por defecto
                console.warn('No se pudo acceder al contenido del iframe:', error);
                setIframeHeight('800px');
            }
        };

        // Ejecutar cuando el iframe carga
        iframe.addEventListener('load', adjustHeight);
        
        // Timeout adicional para contenido dinámico
        const timer = setTimeout(adjustHeight, 100);

        return () => {
            iframe.removeEventListener('load', adjustHeight);
            clearTimeout(timer);
        };
    }, [htmlContent]);

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
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Vista Previa
                </span>
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-1.5 rounded-md transition-all ${
                            viewMode === 'desktop' 
                                ? 'bg-white shadow-sm text-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Vista Desktop"
                        aria-label="Cambiar a vista de escritorio"
                    >
                        <ComputerDesktopIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-1.5 rounded-md transition-all ${
                            viewMode === 'mobile' 
                                ? 'bg-white shadow-sm text-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Vista Móvil"
                        aria-label="Cambiar a vista móvil"
                    >
                        <DevicePhoneMobileIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Contenedor del Preview con scroll */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Header falso de correo */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Asunto:</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{subject}</p>
                </div>

                {/* Área scrolleable del contenido del email */}
                <div 
                    className="overflow-y-auto overflow-x-hidden bg-gray-50 flex-1"
                    style={{ 
                        maxHeight: 'calc(100vh - 280px)', // Ajustar según necesidad
                        minHeight: '400px'
                    }}
                >
                    {/* Contenedor responsivo centrado */}
                    <div 
                        className={`transition-all duration-300 mx-auto py-6 ${
                            viewMode === 'mobile' ? 'w-full max-w-[375px] px-4' : 'w-full px-6'
                        }`}
                    >
                        {/* Iframe sin scroll interno */}
                        <iframe
                            ref={iframeRef}
                            srcDoc={htmlContent}
                            title="Vista previa del correo electrónico"
                            className="w-full border-none bg-white shadow-sm rounded-lg"
                            style={{ 
                                height: iframeHeight,
                                minHeight: '400px',
                                display: 'block'
                            }}
                            sandbox="allow-same-origin"
                            scrolling="no"
                        />
                    </div>
                </div>

                {/* Footer opcional con info */}
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex-shrink-0">
                    <p className="text-xs text-gray-500 text-center">
                        {viewMode === 'desktop' ? 'Vista de escritorio' : 'Vista móvil (375px)'}
                    </p>
                </div>
            </div>
        </div>
    );
};
