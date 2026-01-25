import { useEffect, useState } from 'react';
import { 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    XCircleIcon, 
    InformationCircleIcon,
    XMarkIcon 
} from '@heroicons/react/24/outline';
import type { Toast, ToastType } from './ToastContext';

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

const toastConfig: Record<ToastType, { 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
    bgColor: string;
    iconColor: string;
    borderColor: string;
    titleColor: string;
}> = {
    success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-white',
        iconColor: 'text-green-500',
        borderColor: 'border-l-green-500',
        titleColor: 'text-green-800',
    },
    error: {
        icon: XCircleIcon,
        bgColor: 'bg-white',
        iconColor: 'text-red-500',
        borderColor: 'border-l-red-500',
        titleColor: 'text-red-800',
    },
    warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-white',
        iconColor: 'text-amber-500',
        borderColor: 'border-l-amber-500',
        titleColor: 'text-amber-800',
    },
    info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-white',
        iconColor: 'text-blue-500',
        borderColor: 'border-l-blue-500',
        titleColor: 'text-blue-800',
    },
};

export function ToastItem({ toast, onClose }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    useEffect(() => {
        // Trigger entrada con animación
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div
            className={`
                pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl 
                ${config.bgColor} shadow-lg ring-1 ring-black/5
                border-l-4 ${config.borderColor}
                transform transition-all duration-300 ease-out
                ${isVisible && !isLeaving 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-full opacity-0'}
            `}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icono */}
                    <div className="flex-shrink-0">
                        <Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className={`text-sm font-semibold ${config.titleColor}`}>
                            {toast.title}
                        </p>
                        {toast.message && (
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                {toast.message}
                            </p>
                        )}
                    </div>
                    
                    {/* Botón cerrar */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={handleClose}
                            className="inline-flex rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                        >
                            <span className="sr-only">Cerrar</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Barra de progreso (opcional para indicar tiempo restante) */}
            {toast.duration && toast.duration > 0 && (
                <div className="h-1 bg-gray-100">
                    <div 
                        className={`h-full ${config.iconColor.replace('text-', 'bg-')} opacity-30`}
                        style={{
                            animation: `shrink ${toast.duration}ms linear forwards`,
                        }}
                    />
                </div>
            )}
            
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}
