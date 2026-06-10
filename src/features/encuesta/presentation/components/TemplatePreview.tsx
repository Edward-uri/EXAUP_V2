import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface TemplatePreviewProps {
    htmlContent: string;
    subject: string;
}

const MOBILE_FRAME_WIDTH = 375; // ancho del marco "móvil"
const HORIZONTAL_PADDING = 32;  // px-4 a cada lado del área de scroll

export const TemplatePreview = ({ htmlContent, subject }: TemplatePreviewProps) => {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Tamaño natural del contenido del correo (normalmente ancho fijo ~600px)
    const [contentSize, setContentSize] = useState({ width: 600, height: 600 });
    // Ancho disponible del panel, para calcular el factor de escala
    const [availWidth, setAvailWidth] = useState(0);

    // Mide el tamaño real del contenido del iframe.
    // Se recalcula con ResizeObserver, al cargar imágenes y al cambiar de vista,
    // para no medir antes de tiempo y evitar recortes.
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let observer: ResizeObserver | null = null;
        const imgListeners: Array<{ img: HTMLImageElement; handler: () => void }> = [];
        let initialized = false;

        const measure = () => {
            try {
                const doc = iframe.contentWindow?.document;
                if (!doc?.body) return;
                const width = Math.max(
                    doc.body.scrollWidth,
                    doc.documentElement.scrollWidth,
                    doc.body.offsetWidth,
                    1,
                );
                const height = Math.max(
                    doc.body.scrollHeight,
                    doc.documentElement.scrollHeight,
                    doc.body.offsetHeight,
                    doc.documentElement.offsetHeight,
                    1,
                );
                // +4px de colchón vertical para evitar recortes por redondeo.
                // Sólo actualiza si cambió, para evitar renders y bucles de ResizeObserver.
                const nextHeight = height + 4;
                setContentSize((prev) =>
                    prev.width === width && prev.height === nextHeight
                        ? prev
                        : { width, height: nextHeight },
                );
            } catch (error) {
                console.warn('No se pudo acceder al contenido del iframe:', error);
            }
        };

        const init = () => {
            const doc = iframe.contentWindow?.document;
            if (!doc?.body) return;

            measure();
            if (initialized) return;
            initialized = true;

            // Recalcula ante cualquier reflow (fuentes, contenido dinámico)
            if (typeof ResizeObserver !== 'undefined') {
                observer = new ResizeObserver(() => measure());
                observer.observe(doc.body);
                observer.observe(doc.documentElement);
            }

            // Recalcula cuando terminan de cargar las imágenes (logo, etc.)
            Array.from(doc.images).forEach((img) => {
                if (!img.complete) {
                    const handler = () => measure();
                    img.addEventListener('load', handler);
                    img.addEventListener('error', handler);
                    imgListeners.push({ img, handler });
                }
            });
        };

        iframe.addEventListener('load', init);
        // Por si el srcDoc ya estaba listo antes de montar el listener
        const timer = setTimeout(init, 100);

        return () => {
            iframe.removeEventListener('load', init);
            clearTimeout(timer);
            observer?.disconnect();
            imgListeners.forEach(({ img, handler }) => {
                img.removeEventListener('load', handler);
                img.removeEventListener('error', handler);
            });
        };
    }, [htmlContent, viewMode]);

    // Mide el ancho disponible del panel para escalar el correo y que no se corte.
    useEffect(() => {
        const el = scrollAreaRef.current;
        if (!el) return;
        const update = () => setAvailWidth(el.clientWidth);
        update();
        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(update);
            ro.observe(el);
        }
        return () => ro?.disconnect();
    }, [htmlContent]);

    if (!htmlContent) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <ComputerDesktopIcon className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Selecciona una plantilla para ver la vista previa</p>
            </div>
        );
    }

    // Ancho del "marco" según el modo y factor de escala para que el correo
    // (de ancho fijo) quepa sin recortarse horizontalmente. Mientras no se haya
    // medido el panel, se usa el ancho natural (escala 1) para evitar parpadeos.
    const available = availWidth > 0
        ? Math.max(availWidth - HORIZONTAL_PADDING, 1)
        : contentSize.width;
    const frameWidth = viewMode === 'mobile'
        ? Math.min(MOBILE_FRAME_WIDTH, available)
        : available;
    const scale = contentSize.width > 0 ? Math.min(1, frameWidth / contentSize.width) : 1;
    const scaledWidth = Math.round(contentSize.width * scale);
    const scaledHeight = Math.round(contentSize.height * scale);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Toolbar del Preview */}
            <div className="flex items-center justify-between mb-3 px-1 flex-shrink-0">
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                {/* Header falso de correo */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Asunto:</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{subject}</p>
                </div>

                {/* Área scrolleable: rellena el alto disponible (flex-1 min-h-0).
                    El correo se escala para caber a lo ancho sin recortarse. */}
                <div
                    ref={scrollAreaRef}
                    className="overflow-y-auto overflow-x-hidden bg-gray-50 flex-1 min-h-0"
                >
                    <div className="flex justify-center py-6 px-4">
                        {/* Caja que reserva el espacio ya escalado y recorta sobrantes de subpíxel */}
                        <div
                            className="bg-white shadow-sm rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300"
                            style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
                        >
                            {/* Iframe a tamaño natural, escalado para encajar (sin scroll interno) */}
                            <iframe
                                ref={iframeRef}
                                srcDoc={htmlContent}
                                title="Vista previa del correo electrónico"
                                className="border-none bg-white block"
                                style={{
                                    width: `${contentSize.width}px`,
                                    height: `${contentSize.height}px`,
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'top left',
                                }}
                                sandbox="allow-same-origin"
                                scrolling="no"
                            />
                        </div>
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
