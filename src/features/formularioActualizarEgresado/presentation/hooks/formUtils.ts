import type { FormData } from '../types';

export const TOTAL_STEPS = 4;
export const MAX_IMAGE_SIZE_MB = 5;
export const BLOB_PREFIX = 'blob:';

export const INITIAL_FORM_STATE: FormData = {
  egresadoId: undefined,
  curp: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  email: '',
  calle: '',
  colonia: '',
  numero: '',
  estado: '',
  ciudad: '',
  codigoPostal: '',
  trabajaActualmente: false,
  empresa: '',
  puesto: '',
  sector: '',
  actividad: '',
  orgulloImagen: null,
  orgulloNombre: '',
  orgulloCorreo: '',
  orgulloCarrera: '',
  orgulloMensaje: '',
};

export const sanitizeImageValue = (value?: string | null) => {
  if (!value) return null;
  return value.startsWith(BLOB_PREFIX) ? null : value;
};

export const firstNonEmpty = (
  ...values: Array<string | null | undefined>
): string | undefined => {
  for (const v of values) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    return v as string;
  }
  return undefined;
};

export const normalizeDateToYMD = (value?: string | null): string | undefined => {
  if (!value) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    if (value.includes('T')) {
      const [ymd] = value.split('T');
      if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
        return ymd;
      }
    }
    return undefined;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
