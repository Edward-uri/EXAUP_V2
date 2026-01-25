import { TemplatePreview } from '../TemplatePreview';

interface EmailPreviewPanelProps {
    htmlContent: string;
    subject: string;
}

export function EmailPreviewPanel({ htmlContent, subject }: EmailPreviewPanelProps) {
    return (
        <div className="lg:sticky lg:top-8 h-fit">
            <TemplatePreview
                htmlContent={htmlContent}
                subject={subject}
            />
        </div>
    );
}
