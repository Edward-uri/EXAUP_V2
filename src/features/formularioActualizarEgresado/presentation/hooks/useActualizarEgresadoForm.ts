import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { FormData } from '../types';
import { useAlert } from '../../../../shared/components/Alert';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';

const TOTAL_STEPS = 4;
const MAX_IMAGE_SIZE_MB = 5;
const BLOB_PREFIX = 'blob:';

const INITIAL_FORM_STATE: FormData = {
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

const sanitizeImageValue = (value?: string | null) => {
  if (!value) return null;
  return value.startsWith(BLOB_PREFIX) ? null : value;
};

const firstNonEmpty = (...values: Array<string | null | undefined>): string | undefined => {
  for (const v of values) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    return v as string;
  }
  return undefined;
};

const normalizeDateToYMD = (value?: string | null): string | undefined => {
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

export const useActualizarEgresadoForm = () => {
  const alert = useAlert();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);
  const [loadingCurp, setLoadingCurp] = useState<boolean>(false);
  const [loadingDomicilio, setLoadingDomicilio] = useState<boolean>(false);
  const [loadingLaboral, setLoadingLaboral] = useState<boolean>(false);
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(false);
  const [domicilioId, setDomicilioId] = useState<string | null>(null);
  const [laboralId, setLaboralId] = useState<string | null>(null);
  const [uploadingImagen, setUploadingImagen] = useState<boolean>(false);
  const previewUrlRef = useRef<string | null>(null);

  const assignLocalPreview = useCallback((nextUrl: string | null) => {
    const current = previewUrlRef.current;
    if (current && current !== nextUrl && current.startsWith(BLOB_PREFIX)) {
      URL.revokeObjectURL(current);
    }
    previewUrlRef.current = nextUrl;
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current && previewUrlRef.current.startsWith(BLOB_PREFIX)) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const getApiErrorMessage = useCallback((err: any, fallback: string) => {
    const status = err?.response?.status as number | undefined;

    if (!err?.response) {
      console.error('[API] Error de red o sin respuesta', err);
      return 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.';
    }

    if (status === 400) {
      return 'Los datos enviados no son válidos. Revisa la información e inténtalo de nuevo.';
    }

    if (status === 401 || status === 403) {
      return 'Tu sesión no es válida o no tienes permiso para realizar esta acción. Intenta volver a iniciar sesión.';
    }

    if (status === 404) {
      return 'No encontramos información con los datos proporcionados. Verifica la información e inténtalo nuevamente.';
    }

    if (status && status >= 500) {
      return 'Ocurrió un problema en el servidor. Inténtalo nuevamente más tarde.';
    }

    console.error('[API] Error no controlado', { status, err });
    return fallback;
  }, []);

  useEffect(() => {
    const saved = EgresadoFormStorageService.loadState();
    if (!saved) return;
    const savedForm = saved.formData ?? {};

    const hasEgresadoId = typeof savedForm.egresadoId === 'string' && savedForm.egresadoId.trim() !== '';
    const hasDomicilio = Boolean(
      savedForm.calle ||
      savedForm.colonia ||
      savedForm.numero ||
      savedForm.codigoPostal ||
      savedForm.estado ||
      savedForm.ciudad
    );

    const restoredCurpValidated =
      typeof saved.curpValidated === 'boolean'
        ? saved.curpValidated
        : hasEgresadoId;
    setCurpValidated(restoredCurpValidated);

    let targetStep = saved.currentStep && saved.currentStep >= 1 && saved.currentStep <= TOTAL_STEPS
      ? saved.currentStep
      : 1;

    if (restoredCurpValidated && targetStep < 2) {
      targetStep = 2;
    }

    if (hasDomicilio && targetStep < 3) {
      targetStep = 3;
    }

    setCurrentStep(targetStep);

    const { orgulloImagen: storedImagen, ...restStored } = savedForm;
    setFormData(prev => ({
      ...prev,
      ...restStored,
      orgulloImagen: sanitizeImageValue(storedImagen) ?? prev.orgulloImagen,
    }));
  }, []);

  useEffect(() => {
    const { orgulloImagen, ...restFormData } = formData;
    const sanitizedImagen = sanitizeImageValue(orgulloImagen ?? undefined);

    EgresadoFormStorageService.saveState({
      currentStep,
      curpValidated,
      formData: {
        ...restFormData,
        ...(sanitizedImagen ? { orgulloImagen: sanitizedImagen } : {}),
      },
    });
  }, [currentStep, curpValidated, formData]);

  const loadPerfilFromApi = useCallback(async (egresadoId: string) => {
    try {
      const result = await ActualizarEgresadoService.getPerfilActual(egresadoId);
      if (!result) {
        return;
      }

      const attrs = result.attributes || {};

      setFormData(prev => {
        const bestFecha = firstNonEmpty(attrs.fecha_nacimiento, prev.fechaNacimiento) ?? prev.fechaNacimiento;
        const normalizedFecha = normalizeDateToYMD(bestFecha) ?? prev.fechaNacimiento;

        return {
          ...prev,
          egresadoId: prev.egresadoId ?? result.id,
          nombre: firstNonEmpty(attrs.nombre, prev.nombre) ?? prev.nombre,
          apellidoPaterno:
            firstNonEmpty(attrs.apellido_paterno, attrs.primer_apellido, prev.apellidoPaterno) ??
            prev.apellidoPaterno,
          apellidoMaterno:
            firstNonEmpty(attrs.apellido_materno, attrs.segundo_apellido, prev.apellidoMaterno) ??
            prev.apellidoMaterno,
          fechaNacimiento: normalizedFecha,
          email: firstNonEmpty(attrs.email, prev.email) ?? prev.email,
          orgulloImagen: attrs.imagen_egresado ?? prev.orgulloImagen,
        };
      });
    } catch (err) {
      console.error('[Step1] Error al cargar perfil de egresado', err);
    }
  }, []);

  // Si ya hay CURP validada y egresadoId pero no tenemos imagen en el formulario,
  // intentamos hidratarla desde el perfil completo del backend.
  useEffect(() => {
    if (!curpValidated || !formData.egresadoId || formData.orgulloImagen) {
      return;
    }

    void loadPerfilFromApi(formData.egresadoId);
  }, [curpValidated, formData.egresadoId, formData.orgulloImagen, loadPerfilFromApi]);

  const loadDomicilioFromApi = useCallback(async () => {
    try {
      const result = await ActualizarEgresadoService.getDatosDomiciliarios();
      if (!result) {
        setDomicilioId(null);
        return;
      }

      setDomicilioId(result.id);
      const attrs = result.attributes || {};

      setFormData(prev => ({
        ...prev,
        calle: attrs.calle ?? prev.calle,
        colonia: attrs.colonia ?? prev.colonia,
        numero: attrs.numero_exterior ?? prev.numero,
        codigoPostal: attrs.codigo_postal ?? prev.codigoPostal,
        estado: attrs.estado ?? prev.estado,
        ciudad: attrs.ciudad ?? prev.ciudad,
      }));
    } catch (err) {
      console.error('[Step2] Error al cargar datos domiciliarios', err);
    }
  }, []);

  const loadLaboralFromApi = useCallback(async () => {
    try {
      const result = await ActualizarEgresadoService.getDatosLaborales();
      if (!result) {
        setLaboralId(null);
        return;
      }

      setLaboralId(result.id);
      const attrs = result.attributes || {};

      setFormData(prev => ({
        ...prev,
        trabajaActualmente: typeof attrs.trabaja_actualmente === 'boolean' ? attrs.trabaja_actualmente : prev.trabajaActualmente,
        empresa: attrs.nombre_empresa ?? prev.empresa,
        puesto: attrs.puesto ?? prev.puesto,
        sector: attrs.id_sector !== undefined && attrs.id_sector !== null ? String(attrs.id_sector) : prev.sector,
        actividad: attrs.actividad_principal ?? prev.actividad,
      }));
    } catch (err) {
      console.error('[Step3] Error al cargar datos laborales', err);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const uploadOrgulloImage = useCallback(async (file: File, fallbackImage: string | null) => {
    if (!formData.egresadoId) {
      console.warn('[Etapa1][Imagen] Intento de subir imagen sin egresadoId');
      alert.warning('CURP requerida', 'Primero valida tu CURP antes de subir tu foto de perfil.');
      return;
    }

    console.log('[Etapa1][Imagen] Iniciando subida de imagen', {
      name: file.name,
      size: file.size,
      type: file.type,
      egresadoId: formData.egresadoId,
    });
    setUploadingImagen(true);
    try {
      const uploadedUrl = await ActualizarEgresadoService.uploadOrgulloImage(file, formData.egresadoId);
      console.log('[Etapa1][Imagen] Imagen subida correctamente, URL recibida:', uploadedUrl);
      setFormData(prev => ({
        ...prev,
        orgulloImagen: uploadedUrl,
      }));
    } catch (err) {
      console.error('[Etapa1][Imagen] Error durante la subida de imagen', err);
      const message = getApiErrorMessage(err, 'No se pudo subir la imagen');
      alert.error('Error al subir imagen', message);
      setFormData(prev => ({
        ...prev,
        orgulloImagen: fallbackImage,
      }));
    } finally {
      assignLocalPreview(null);
      setUploadingImagen(false);
    }
  }, [alert, assignLocalPreview, formData.egresadoId, getApiErrorMessage]);

  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (uploadingImagen) {
      alert.warning('Carga en progreso', 'Espera a que finalice la subida actual antes de elegir otra imagen.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      console.log('[Etapa1][Imagen] No se seleccionó ningún archivo');
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.warn('[Etapa1][Imagen] Archivo inválido, no es una imagen', {
        name: file.name,
        type: file.type,
      });
      alert.warning('Archivo inválido', 'Selecciona una imagen con formato JPG, PNG o similar.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      console.warn('[Etapa1][Imagen] Archivo demasiado grande', {
        name: file.name,
        size: file.size,
        maxSizeMB: MAX_IMAGE_SIZE_MB,
      });
      alert.warning('Archivo muy grande', `La imagen debe pesar menos de ${MAX_IMAGE_SIZE_MB} MB.`);
      e.target.value = '';
      return;
    }

    console.log('[Etapa1][Imagen] Archivo válido, generando preview local', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    const fallbackImage = sanitizeImageValue(formData.orgulloImagen ?? undefined);
    const previewUrl = URL.createObjectURL(file);
    console.log('[Etapa1][Imagen] URL de preview generada:', previewUrl);
    assignLocalPreview(previewUrl);
    setFormData(prev => ({
      ...prev,
      orgulloImagen: previewUrl,
    }));

    console.log('[Etapa1][Imagen] Lanzando subida al servidor con fallback:', fallbackImage);
    void uploadOrgulloImage(file, fallbackImage ?? null);
    e.target.value = '';
  }, [alert, assignLocalPreview, formData.orgulloImagen, uploadOrgulloImage, uploadingImagen]);

  const handleValidateCurp = useCallback(async () => {
    if (formData.curp.trim().length < 10) {
      alert.warning('CURP invalida', 'Por favor, ingresa una CURP valida (minimo 10 caracteres).');
      return;
    }

    setLoadingCurp(true);
    try {
      const auth = await ActualizarEgresadoService.login(
        formData.curp.trim().toUpperCase()
      );

      // Primero, llenamos con la mejor info disponible del login
      setFormData(prev => {
        const bestFecha = firstNonEmpty(auth.fechaNacimiento, prev.fechaNacimiento) ?? prev.fechaNacimiento;
        const normalizedFecha = normalizeDateToYMD(bestFecha) ?? prev.fechaNacimiento;

        return {
          ...prev,
          egresadoId: auth.id ?? prev.egresadoId,
          nombre: firstNonEmpty(auth.nombre, prev.nombre) ?? prev.nombre,
          apellidoPaterno: firstNonEmpty(auth.apellidoPaterno, prev.apellidoPaterno) ?? prev.apellidoPaterno,
          apellidoMaterno: firstNonEmpty(auth.apellidoMaterno, prev.apellidoMaterno) ?? prev.apellidoMaterno,
          fechaNacimiento: normalizedFecha,
          email: firstNonEmpty(auth.email, prev.email) ?? prev.email,
        };
      });

      setCurpValidated(true);

      await Promise.all([
        loadPerfilFromApi(auth.id),
        loadDomicilioFromApi(),
        loadLaboralFromApi(),
      ]);
      console.log('[Etapa1][Perfil] Después de validar CURP y cargar perfil completo, orgulloImagen =',
        (prev => prev)(formData).orgulloImagen
      );
    } catch (err) {
      setCurpValidated(false);
      const message = getApiErrorMessage(err, 'No se pudo validar la CURP');
      alert.error('Error al validar', message);
    } finally {
      setLoadingCurp(false);
    }
  }, [alert, formData.curp, getApiErrorMessage, loadDomicilioFromApi, loadLaboralFromApi, loadPerfilFromApi]);

  const handleGuardarDomicilioYContinuar = useCallback(async () => {
    setLoadingDomicilio(true);
    try {
      if (
        !formData.calle.trim() ||
        !formData.colonia.trim() ||
        !formData.numero.trim() ||
        !formData.codigoPostal.trim() ||
        !formData.estado.trim() ||
        !formData.ciudad.trim()
      ) {
        alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
        return;
      }

      const payload = {
        calle: formData.calle,
        colonia: formData.colonia,
        numero_exterior: formData.numero,
        codigo_postal: formData.codigoPostal,
        estado: formData.estado,
        ciudad: formData.ciudad,
      };

      if (domicilioId) {
        await ActualizarEgresadoService.updateDatosDomiciliarios(domicilioId, payload);
      } else {
        await ActualizarEgresadoService.createDatosDomiciliarios(payload);
        await loadDomicilioFromApi();
      }
      nextStep();
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudieron guardar los datos domiciliarios');
      alert.error('Error al guardar', message);
    } finally {
      setLoadingDomicilio(false);
    }
  }, [alert, domicilioId, formData.calle, formData.ciudad, formData.codigoPostal, formData.colonia, formData.estado, formData.numero, getApiErrorMessage, loadDomicilioFromApi, nextStep]);

  const handleActualizarPerfilYContinuar = useCallback(async () => {
    if (uploadingImagen) {
      alert.warning('Imagen en proceso', 'Espera a que termine la carga de tu foto antes de continuar.');
      return;
    }

    if (!formData.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    if (
      !formData.nombre.trim() ||
      !formData.apellidoPaterno.trim() ||
      !formData.apellidoMaterno.trim() ||
      !formData.fechaNacimiento.trim() ||
      !formData.email.trim()
    ) {
      alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
      return;
    }

    setLoadingPerfil(true);
    try {
      const imagenPayload = sanitizeImageValue(formData.orgulloImagen ?? undefined) ?? undefined;

      await ActualizarEgresadoService.updatePerfil(formData.egresadoId, {
        email: formData.email || undefined,
        fecha_nacimiento: formData.fechaNacimiento || undefined,
        imagen_egresado: imagenPayload,
      });
      nextStep();
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo actualizar el perfil');
      alert.error('Error al actualizar', message);
    } finally {
      setLoadingPerfil(false);
    }
  }, [alert, formData.apellidoMaterno, formData.apellidoPaterno, formData.email, formData.egresadoId, formData.fechaNacimiento, formData.nombre, formData.orgulloImagen, getApiErrorMessage, nextStep, uploadingImagen]);

  const handleGuardarDatosLaborales = useCallback(async () => {
    const sectorValue = formData.sector.trim();
    const sectorId = sectorValue ? Number(sectorValue) : null;

    if (formData.trabajaActualmente) {
      if (
        !formData.empresa.trim() ||
        !formData.puesto.trim() ||
        !formData.actividad.trim() ||
        !sectorValue
      ) {
        alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
        return false;
      }

      if (Number.isNaN(sectorId)) {
        alert.warning('Datos incompletos', 'Por favor completa todos los campos antes de continuar.');
        return false;
      }
    }

    setLoadingLaboral(true);
    try {
      const payload = formData.trabajaActualmente
        ? {
            trabaja_actualmente: true,
            nombre_empresa: formData.empresa,
            puesto: formData.puesto,
            id_sector: sectorId,
            actividad_principal: formData.actividad,
          }
        : {
            trabaja_actualmente: false,
            nombre_empresa: '',
            puesto: '',
            id_sector: null,
            actividad_principal: '',
          };

      let existingLaboralId = laboralId;

      if (!existingLaboralId) {
        const existing = await ActualizarEgresadoService.getDatosLaborales();
        if (existing?.id) {
          existingLaboralId = existing.id;
          setLaboralId(existing.id);
        }
      }

      if (existingLaboralId) {
        await ActualizarEgresadoService.updateDatosLaborales(payload);
      } else {
        await ActualizarEgresadoService.createDatosLaborales(payload);
        await loadLaboralFromApi();
      }
      return true;
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudieron guardar los datos laborales');
      alert.error('Error al guardar', message);
      return false;
    } finally {
      setLoadingLaboral(false);
    }
  }, [alert, formData.actividad, formData.empresa, formData.puesto, formData.sector, formData.trabajaActualmente, getApiErrorMessage, laboralId, loadLaboralFromApi]);

  const handleFinalizarSoloTresEtapas = useCallback(async () => {
    const saved = await handleGuardarDatosLaborales();
    if (!saved) {
      return;
    }
    EgresadoFormStorageService.clearState();
    alert.success('Datos actualizados', 'Los datos se actualizaron correctamente (sin Orgullo UP).');
    console.log('Enviando datos parciales:', formData);
  }, [alert, formData, handleGuardarDatosLaborales]);

  const handleUnirseOrgulloUp = useCallback(async () => {
    const saved = await handleGuardarDatosLaborales();
    if (!saved) {
      return;
    }
    if (!formData.orgulloNombre) {
      setFormData(prev => ({
        ...prev,
        orgulloNombre: `${prev.nombre} ${prev.apellidoPaterno}`.trim(),
        orgulloCorreo: prev.email,
      }));
    }
    nextStep();
  }, [formData.apellidoPaterno, formData.email, formData.nombre, formData.orgulloNombre, handleGuardarDatosLaborales, nextStep]);

  const handleFinalizarTodo = useCallback(() => {
    EgresadoFormStorageService.clearState();
    alert.success('Actualizacion completa', 'Tus datos han sido actualizados y te has unido a Orgullo UP.');
    console.log('Enviando todos los datos:', formData);
  }, [alert, formData]);

  return {
    formData,
    setFormData,
    currentStep,
    curpValidated,
    loadingCurp,
    loadingDomicilio,
    loadingLaboral,
    loadingPerfil,
    uploadingImagen,
    handleChange,
    handleImageUpload,
    handleValidateCurp,
    handleGuardarDomicilioYContinuar,
    handleActualizarPerfilYContinuar,
    handleFinalizarSoloTresEtapas,
    handleUnirseOrgulloUp,
    handleFinalizarTodo,
    nextStep,
    prevStep,
  };
};
