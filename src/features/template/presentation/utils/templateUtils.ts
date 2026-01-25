import type { TemplateCorreo } from "../../../template/domain/TemplateCorreo";

export const generatePreviewHtml = (template: TemplateCorreo, customContent?: string): string => {
    const contentToRender = customContent !== undefined ? customContent : template.attributes.body;

    if (template.attributes.layout_html) {
        return template.attributes.layout_html.replace('{{DYNAMIC_CONTENT}}', contentToRender);
    }

    return contentToRender;
};