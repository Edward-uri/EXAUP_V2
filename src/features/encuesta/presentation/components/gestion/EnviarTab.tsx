import { EmailConfig } from './EmailConfig';
import { EmailPreviewPanel } from './EmailPreviewPanel';

interface EnviarTabProps {
    editingTemplate: boolean;
    savingTemplate: boolean;
    templateContent: string;
    filtroEnvio: 'pendientes' | 'todos';
    sending: boolean;
    currentTemplate: any;
    previewHtml: string;
    onTemplateChange: (content: string) => void;
    onEditToggle: (editing: boolean) => void;
    onSaveTemplate: () => void;
    onCancelEdit: () => void;
    onFiltroChange: (filtro: 'pendientes' | 'todos') => void;
    onEnviar: () => void;
}

export function EnviarTab({
    editingTemplate,
    savingTemplate,
    templateContent,
    filtroEnvio,
    sending,
    currentTemplate,
    previewHtml,
    onTemplateChange,
    onEditToggle,
    onSaveTemplate,
    onCancelEdit,
    onFiltroChange,
    onEnviar
}: EnviarTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda - Configuración y Envío */}
            <EmailConfig
                editingTemplate={editingTemplate}
                savingTemplate={savingTemplate}
                templateContent={templateContent}
                filtroEnvio={filtroEnvio}
                sending={sending}
                onTemplateChange={onTemplateChange}
                onEditToggle={onEditToggle}
                onSaveTemplate={onSaveTemplate}
                onCancelEdit={onCancelEdit}
                onFiltroChange={onFiltroChange}
                onEnviar={onEnviar}
            />

            {/* Columna Derecha - Preview del Email */}
            {currentTemplate && (
                <EmailPreviewPanel
                    htmlContent={previewHtml}
                    subject={currentTemplate.attributes.subject || "Vista Previa del Correo"}
                />
            )}
        </div>
    );
}
