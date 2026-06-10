import { TemplatePreview } from '../TemplatePreview';

interface EmailPreviewPanelProps {
    htmlContent: string;
    subject: string;
}

export function EmailPreviewPanel({ htmlContent, subject }: EmailPreviewPanelProps) {
    return (
        <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] flex flex-col">
            <TemplatePreview
                htmlContent={htmlContent}
                subject={subject}
            />
        </div>
    );
}
