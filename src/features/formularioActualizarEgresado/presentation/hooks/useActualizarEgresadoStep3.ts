import { useCallback, useEffect, useState } from 'react';
import { useAlert } from '../../../../shared/components/Alert';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';
import { clearEgresadoSession } from '../../../../core/auth-context';
import type { FormData } from '../types';
import { useApiErrorMessage } from './useApiErrorMessage';

interface UseActualizarEgresadoStep3Params {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  curpValidated: boolean;
  nextStep: () => void;
  resetStep: () => void;
}

export const useActualizarEgresadoStep3 = ({
  formData,
  setFormData,
  curpValidated,
  nextStep,
  resetStep,
}: UseActualizarEgresadoStep3Params) => {
  const alert = useAlert();
  const getApiErrorMessage = useApiErrorMessage();

  const [loadingLaboral, setLoadingLaboral] = useState<boolean>(false);
  const [laboralId, setLaboralId] = useState<string | null>(null);

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
        trabajaActualmente:
          typeof attrs.trabaja_actualmente === 'boolean'
            ? attrs.trabaja_actualmente
            : prev.trabajaActualmente,
        empresa: attrs.nombre_empresa ?? prev.empresa,
        puesto: attrs.puesto ?? prev.puesto,
        sector:
          attrs.id_sector !== undefined && attrs.id_sector !== null
            ? String(attrs.id_sector)
            : prev.sector,
        actividad: attrs.actividad_principal ?? prev.actividad,
      }));
    } catch (err) {
      console.error('[Step3] Error al cargar datos laborales', err);
    }
  }, [setFormData]);

  useEffect(() => {
    if (!curpValidated) return;
    void loadLaboralFromApi();
  }, [curpValidated, loadLaboralFromApi]);

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
        alert.warning(
          'Datos incompletos',
          'Por favor completa todos los campos antes de continuar.',
        );
        return false;
      }

      if (Number.isNaN(sectorId)) {
        alert.warning(
          'Datos incompletos',
          'Por favor completa todos los campos antes de continuar.',
        );
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
      const message = getApiErrorMessage(
        err,
        'No se pudieron guardar los datos laborales',
      );
      alert.error('Error al guardar', message);
      return false;
    } finally {
      setLoadingLaboral(false);
    }
  }, [
    alert,
    formData.actividad,
    formData.empresa,
    formData.puesto,
    formData.sector,
    formData.trabajaActualmente,
    getApiErrorMessage,
    laboralId,
    loadLaboralFromApi,
  ]);

  const handleFinalizarSoloTresEtapas = useCallback(async () => {
    const saved = await handleGuardarDatosLaborales();
    if (!saved) {
      return;
    }
    EgresadoFormStorageService.clearState();
    clearEgresadoSession();
    alert.success(
      'Datos actualizados',
      'Los datos se actualizaron correctamente (sin Orgullo UP).',
    );
    console.log('Enviando datos parciales:', formData);
    resetStep();
  }, [alert, formData, handleGuardarDatosLaborales, resetStep]);

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
  }, [formData.apellidoPaterno, formData.email, formData.nombre, formData.orgulloNombre, handleGuardarDatosLaborales, nextStep, setFormData]);

  const handleFinalizarTodo = useCallback(() => {
    EgresadoFormStorageService.clearState();
    clearEgresadoSession();
    alert.success(
      'Actualizacion completa',
      'Tus datos han sido actualizados y te has unido a Orgullo UP.',
    );
    console.log('Enviando todos los datos:', formData);
    resetStep();
  }, [alert, formData, resetStep]);

  return {
    loadingLaboral,
    handleGuardarDatosLaborales,
    handleFinalizarSoloTresEtapas,
    handleUnirseOrgulloUp,
    handleFinalizarTodo,
  };
};
