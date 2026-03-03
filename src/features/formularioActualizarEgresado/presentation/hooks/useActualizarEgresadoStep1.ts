import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useAlert } from '../../../../shared/components/Alert';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';
import type { FormData } from '../types';
import { BLOB_PREFIX, MAX_IMAGE_SIZE_MB, firstNonEmpty, normalizeDateToYMD, sanitizeImageValue } from './formUtils';
import { useApiErrorMessage } from './useApiErrorMessage';

interface UseActualizarEgresadoStep1Params {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  curpValidated: boolean;
  setCurpValidated: (value: boolean) => void;
  nextStep: () => void;
}

export const useActualizarEgresadoStep1 = ({
  formData,
  setFormData,
  curpValidated,
  setCurpValidated,
  nextStep,
}: UseActualizarEgresadoStep1Params) => {
  const alert = useAlert();
  const getApiErrorMessage = useApiErrorMessage();

  const [loadingCurp, setLoadingCurp] = useState<boolean>(false);
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(false);
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

  const loadPerfilFromApi = useCallback(
    async (egresadoId: string) => {
      try {
        const result = await ActualizarEgresadoService.getPerfilActual(egresadoId);
        if (!result) {
          return;
        }

        const attrs = result.attributes || {};

        setFormData(prev => {
          const bestFecha =
            firstNonEmpty(attrs.fecha_nacimiento, prev.fechaNacimiento) ?? prev.fechaNacimiento;
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
    },
    [setFormData],
  );

  useEffect(() => {
    if (!curpValidated || !formData.egresadoId || formData.orgulloImagen) {
      return;
    }

    void loadPerfilFromApi(formData.egresadoId);
  }, [curpValidated, formData.egresadoId, formData.orgulloImagen, loadPerfilFromApi]);

  const uploadOrgulloImage = useCallback(
    async (file: File, fallbackImage: string | null) => {
      if (!formData.egresadoId) {
        console.warn('[Etapa1][Imagen] Intento de subir imagen sin egresadoId');
        alert.warning(
          'CURP requerida',
          'Primero valida tu CURP antes de subir tu foto de perfil.',
        );
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
        const uploadedUrl = await ActualizarEgresadoService.uploadOrgulloImage(
          file,
          formData.egresadoId,
        );
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
    },
    [alert, assignLocalPreview, formData.egresadoId, getApiErrorMessage, setFormData],
  );

  const handleImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (uploadingImagen) {
        alert.warning(
          'Carga en progreso',
          'Espera a que finalice la subida actual antes de elegir otra imagen.',
        );
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
        alert.warning(
          'Archivo inválido',
          'Selecciona una imagen con formato JPG, PNG o similar.',
        );
        e.target.value = '';
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        console.warn('[Etapa1][Imagen] Archivo demasiado grande', {
          name: file.name,
          size: file.size,
          maxSizeMB: MAX_IMAGE_SIZE_MB,
        });
        alert.warning(
          'Archivo muy grande',
          `La imagen debe pesar menos de ${MAX_IMAGE_SIZE_MB} MB.`,
        );
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
    },
    [alert, assignLocalPreview, formData.orgulloImagen, uploadOrgulloImage, uploadingImagen, setFormData],
  );

  const handleValidateCurp = useCallback(async () => {
    if (formData.curp.trim().length < 10) {
      alert.warning(
        'CURP invalida',
        'Por favor, ingresa una CURP valida (minimo 10 caracteres).',
      );
      return;
    }

    setLoadingCurp(true);
    try {
      const auth = await ActualizarEgresadoService.login(formData.curp.trim().toUpperCase());

      setFormData(prev => {
        const bestFecha =
          firstNonEmpty(auth.fechaNacimiento, prev.fechaNacimiento) ?? prev.fechaNacimiento;
        const normalizedFecha = normalizeDateToYMD(bestFecha) ?? prev.fechaNacimiento;

        return {
          ...prev,
          egresadoId: auth.id ?? prev.egresadoId,
          nombre: firstNonEmpty(auth.nombre, prev.nombre) ?? prev.nombre,
          apellidoPaterno:
            firstNonEmpty(auth.apellidoPaterno, prev.apellidoPaterno) ?? prev.apellidoPaterno,
          apellidoMaterno:
            firstNonEmpty(auth.apellidoMaterno, prev.apellidoMaterno) ?? prev.apellidoMaterno,
          fechaNacimiento: normalizedFecha,
          email: firstNonEmpty(auth.email, prev.email) ?? prev.email,
        };
      });

      setCurpValidated(true);

      await loadPerfilFromApi(auth.id);
    } catch (err) {
      setCurpValidated(false);
      const message = getApiErrorMessage(err, 'No se pudo validar la CURP');
      alert.error('Error al validar', message);
    } finally {
      setLoadingCurp(false);
    }
  }, [alert, formData.curp, getApiErrorMessage, loadPerfilFromApi, setCurpValidated, setFormData]);

  const handleActualizarPerfilYContinuar = useCallback(async () => {
    if (uploadingImagen) {
      alert.warning(
        'Imagen en proceso',
        'Espera a que termine la carga de tu foto antes de continuar.',
      );
      return;
    }

    if (!formData.egresadoId) {
      alert.warning(
        'CURP requerida',
        'Primero valida tu CURP para obtener el ID del egresado.',
      );
      return;
    }

    if (
      !formData.nombre.trim() ||
      !formData.apellidoPaterno.trim() ||
      !formData.apellidoMaterno.trim() ||
      !formData.fechaNacimiento.trim() ||
      !formData.email.trim()
    ) {
      alert.warning(
        'Datos incompletos',
        'Por favor completa todos los campos antes de continuar.',
      );
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
  }, [
    alert,
    formData.apellidoMaterno,
    formData.apellidoPaterno,
    formData.email,
    formData.egresadoId,
    formData.fechaNacimiento,
    formData.nombre,
    formData.orgulloImagen,
    getApiErrorMessage,
    nextStep,
    uploadingImagen,
  ]);

  return {
    loadingCurp,
    loadingPerfil,
    uploadingImagen,
    handleImageUpload,
    handleValidateCurp,
    handleActualizarPerfilYContinuar,
  };
};
