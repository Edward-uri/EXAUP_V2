import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import type { FormData } from '../types';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';
import { INITIAL_FORM_STATE, TOTAL_STEPS, sanitizeImageValue } from './formUtils';

export const useActualizarEgresadoFormState = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);

  useEffect(() => {
    const saved = EgresadoFormStorageService.loadState();
    if (!saved) return;
    const savedForm = saved.formData ?? {};

    const hasEgresadoId =
      typeof savedForm.egresadoId === 'string' && savedForm.egresadoId.trim() !== '';
    const hasDomicilio = Boolean(
      savedForm.calle ||
        savedForm.colonia ||
        savedForm.numero ||
        savedForm.codigoPostal ||
        savedForm.estado ||
        savedForm.ciudad,
    );

    const restoredCurpValidated =
      typeof saved.curpValidated === 'boolean' ? saved.curpValidated : hasEgresadoId;
    setCurpValidated(restoredCurpValidated);

    let targetStep =
      saved.currentStep && saved.currentStep >= 1 && saved.currentStep <= TOTAL_STEPS
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

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
  []);

  return {
    formData,
    setFormData,
    currentStep,
    curpValidated,
    setCurpValidated,
    nextStep,
    prevStep,
    handleChange,
  };
};
