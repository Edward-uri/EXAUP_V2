import { Modal } from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const toneByVariant: Record<NonNullable<ConfirmModalProps['variant']>, 'danger' | 'warning' | 'brand'> = {
    danger: 'danger',
    warning: 'warning',
    info: 'brand'
};

export function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar', 
    variant = 'danger', 
    onConfirm, 
    onCancel, 
    loading 
}: ConfirmModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={onCancel}
            title={title}
            description={message}
            tone={toneByVariant[variant]}
            footerAlign="end"
            dismissible={!loading}
            actions={[
                {
                    id: 'cancel',
                    label: cancelText,
                    variant: 'secondary',
                    onClick: onCancel,
                    disabled: loading,
                    closeOnClick: true
                },
                {
                    id: 'confirm',
                    label: confirmText,
                    variant: variant === 'danger' ? 'danger' : 'primary',
                    onClick: onConfirm,
                    loading,
                    closeOnClick: false
                }
            ]}
        />
    );
}
