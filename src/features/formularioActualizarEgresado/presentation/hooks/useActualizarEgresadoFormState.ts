import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import type { FormData } from '../types';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';
import { clearEgresadoSession, getAuthScope, getSessionEgresadoId } from '../../../../core/auth-context';
import { INITIAL_FORM_STATE, TOTAL_STEPS } from './formUtils';

export const useActualizarEgresadoFormState = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);

  useEffect(() => {
    EgresadoFormStorageService.clearState();
    setFormData(INITIAL_FORM_STATE);

    const resuming = getAuthScope() === 'egresado' && !!getSessionEgresadoId();
    if (resuming) {
      setCurrentStep(2);
      setCurpValidated(true);
    } else {
      setCurrentStep(1);
      setCurpValidated(false);
    }

    const handleBeforeUnload = () => {
      EgresadoFormStorageService.clearState();
      clearEgresadoSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      EgresadoFormStorageService.clearState();
    };
  }, []);

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
    [],
  );

  const resetFormToStep1 = useCallback(() => {
    setCurrentStep(1);
    setCurpValidated(false);
  }, []);

  return {
    formData,
    setFormData,
    currentStep,
    curpValidated,
    setCurpValidated,
    nextStep,
    prevStep,
    resetFormToStep1,
    handleChange,
  };
};
