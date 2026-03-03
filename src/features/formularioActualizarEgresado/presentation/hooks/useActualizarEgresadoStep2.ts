import { useCallback, useEffect, useState } from 'react';
import { useAlert } from '../../../../shared/components/Alert';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';
import type { FormData } from '../types';
import { useApiErrorMessage } from './useApiErrorMessage';

interface UseActualizarEgresadoStep2Params {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  curpValidated: boolean;
  nextStep: () => void;
}

export const useActualizarEgresadoStep2 = ({
  formData,
  setFormData,
  curpValidated,
  nextStep,
}: UseActualizarEgresadoStep2Params) => {
  const alert = useAlert();
  const getApiErrorMessage = useApiErrorMessage();

  const [loadingDomicilio, setLoadingDomicilio] = useState<boolean>(false);
  const [domicilioId, setDomicilioId] = useState<string | null>(null);

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
  }, [setFormData]);

  useEffect(() => {
    if (!curpValidated) return;
    void loadDomicilioFromApi();
  }, [curpValidated, loadDomicilioFromApi]);

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
        alert.warning(
          'Datos incompletos',
          'Por favor completa todos los campos antes de continuar.',
        );
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
      const message = getApiErrorMessage(
        err,
        'No se pudieron guardar los datos domiciliarios',
      );
      alert.error('Error al guardar', message);
    } finally {
      setLoadingDomicilio(false);
    }
  }, [
    alert,
    domicilioId,
    formData.calle,
    formData.ciudad,
    formData.codigoPostal,
    formData.colonia,
    formData.estado,
    formData.numero,
    getApiErrorMessage,
    loadDomicilioFromApi,
    nextStep,
  ]);

  return {
    loadingDomicilio,
    handleGuardarDomicilioYContinuar,
  };
};
