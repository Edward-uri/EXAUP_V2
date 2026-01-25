import { ToastItem } from './ToastItem';
import type { Toast } from './ToastContext';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div 
            aria-live="assertive" 
            className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end justify-start px-4 py-6 sm:p-6"
        >
            <div className="flex w-full flex-col items-end space-y-3">
                {toasts.map((toast) => (
                    <ToastItem 
                        key={toast.id} 
                        toast={toast} 
                        onClose={() => onRemove(toast.id)} 
                    />
                ))}
            </div>
        </div>
    );
}
