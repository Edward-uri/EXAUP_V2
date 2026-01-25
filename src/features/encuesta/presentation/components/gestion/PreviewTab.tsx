import { PreviewEncuesta } from '../PreviewEncuesta';
import type { Encuesta } from '../../../domain/Encuesta';

interface PreviewTabProps {
    encuesta: Encuesta;
}

export function PreviewTab({ encuesta }: PreviewTabProps) {
    return <PreviewEncuesta encuesta={encuesta} />;
}
