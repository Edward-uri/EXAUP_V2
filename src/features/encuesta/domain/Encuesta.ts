import type { Formulario } from "../../formulario/domain/Formulario";
import type { TemplateCorreo } from "../../template/domain/TemplateCorreo";

export interface Encuesta {
    id: string;
    type: 'encuestas';
    attributes: {
        nombre: string;
        descripcion: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    relationships?: {
        formulario?: {
            data: { type: 'formularios'; id: string };
        };
        'template-correo'?: {
            data: { type: 'templates-correo'; id: string };
        };
    };
}

export interface EncuestaWithRelations extends Encuesta {
    formulario?: Formulario;
    templateCorreo?: TemplateCorreo;
}
