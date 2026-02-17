import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEffect, type ReactNode, type MouseEvent } from 'react';

export type ModalTone = 'brand' | 'neutral' | 'danger' | 'success' | 'warning';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalActionVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ModalAction {
  id?: string;
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: ModalActionVariant;
  loading?: boolean;
  disabled?: boolean;
  closeOnClick?: boolean;
  autoFocus?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  tone?: ModalTone;
  size?: ModalSize;
  dismissible?: boolean;
  blurBackdrop?: boolean;
  className?: string;
  bodyClassName?: string;
  footerAlign?: 'start' | 'center' | 'end';
  actions?: ModalAction[];
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
};

const toneAccent: Record<ModalTone, string> = {
  brand: 'from-blue-600 to-indigo-500',
  neutral: 'from-slate-500 to-slate-400',
  danger: 'from-rose-600 to-rose-500',
  success: 'from-emerald-500 to-teal-500',
  warning: 'from-amber-500 to-orange-500',
};

const actionVariants: Record<ModalActionVariant, string> = {
  primary: 'bg-blue-900 text-white hover:bg-blue-800',
  secondary: 'bg-white text-gray-800 border border-gray-200 hover:border-gray-300',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  ghost: 'text-blue-900 hover:bg-blue-50',
};

const footerAlignClass: Record<NonNullable<ModalProps['footerAlign']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  icon,
  tone = 'brand',
  size = 'md',
  dismissible = true,
  blurBackdrop = true,
  className = '',
  bodyClassName = '',
  footerAlign = 'end',
  actions,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, dismissible, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!dismissible) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const modalNode = document.getElementById('modal-root') ?? document.body;

  const content = (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      onMouseDown={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`absolute inset-0 ${blurBackdrop ? 'bg-black/40' : 'bg-black/20'}`}
        aria-hidden="true"
      ></div>
      <div
        className={`relative w-full ${sizeClasses[size]} mx-auto`}
      >
        <div
          className={`relative bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in zoom-in duration-200 ${className}`}
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneAccent[tone]}`}></div>
          {dismissible && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          )}

          <div className={`px-6 pt-8 pb-6 ${bodyClassName}`}>
            {(icon || title) && (
              <div className="flex items-start gap-4 mb-4">
                {icon && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    {icon}
                  </div>
                )}
                <div className="flex-1">
                  {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
                  {description && (
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
                  )}
                </div>
              </div>
            )}

            {children}
          </div>

          {actions && actions.length > 0 && (
            <div className={`px-6 pb-6 flex flex-wrap gap-3 ${footerAlignClass[footerAlign]}`}>
              {actions.map((action) => (
                <button
                  key={action.id ?? action.label}
                  type="button"
                  onClick={() => {
                    if (action.disabled || action.loading) return;
                    action.onClick?.();
                    if (action.closeOnClick) {
                      onClose?.();
                    }
                  }}
                  autoFocus={action.autoFocus}
                  disabled={action.disabled || action.loading}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-sm ${
                    actionVariants[action.variant ?? 'primary']
                  } ${action.disabled || action.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {action.loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, modalNode);
}
