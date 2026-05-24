import { EmailConfig } from './EmailConfig';
import { EmailPreviewPanel } from './EmailPreviewPanel';

interface EnviarTabProps {
    filtroEnvio: 'pendientes' | 'todos';
    sending: boolean;
    currentTemplate: any;
    previewHtml: string;
    onFiltroChange: (filtro: 'pendientes' | 'todos') => void;
    onEnviar: () => void;
}

export function EnviarTab({
    filtroEnvio,
    sending,
    currentTemplate,
    previewHtml,
    onFiltroChange,
    onEnviar
}: EnviarTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 items-start">
            <EmailConfig
                filtroEnvio={filtroEnvio}
                sending={sending}
                onFiltroChange={onFiltroChange}
                onEnviar={onEnviar}
            />

            {currentTemplate && (
                <EmailPreviewPanel
                    htmlContent={previewHtml}
                    subject={currentTemplate.attributes.subject || "Vista Previa del Correo"}
                />
            )}
        </div>
    );
}
