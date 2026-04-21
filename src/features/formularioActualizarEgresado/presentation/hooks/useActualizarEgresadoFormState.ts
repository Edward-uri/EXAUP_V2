import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import type { FormData } from '../types';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';
import { clearEgresadoSession } from '../../../../core/auth-context';
import { INITIAL_FORM_STATE, TOTAL_STEPS } from './formUtils';

export const useActualizarEgresadoFormState = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);

  useEffect(() => {
    // Este flujo debe iniciar siempre limpio al entrar a la vista.
    EgresadoFormStorageService.clearState();
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setCurpValidated(false);

    const clearFlowSession = () => {
      EgresadoFormStorageService.clearState();
      clearEgresadoSession();
    };

    const handleBeforeUnload = () => {
      clearFlowSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearFlowSession();
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
