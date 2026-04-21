import { useActualizarEgresadoFormState } from './useActualizarEgresadoFormState';
import { useActualizarEgresadoStep1 } from './useActualizarEgresadoStep1';
import { useActualizarEgresadoStep2 } from './useActualizarEgresadoStep2';
import { useActualizarEgresadoStep3 } from './useActualizarEgresadoStep3';

export const useActualizarEgresadoForm = () => {
  const {
    formData,
    setFormData,
    currentStep,
    curpValidated,
    setCurpValidated,
    nextStep,
    prevStep,
    resetFormToStep1,
    handleChange,
  } = useActualizarEgresadoFormState();

  const step1 = useActualizarEgresadoStep1({
    formData,
    setFormData,
    curpValidated,
    setCurpValidated,
    nextStep,
  });

  const step2 = useActualizarEgresadoStep2({
    formData,
    setFormData,
    curpValidated,
    nextStep,
  });

  const step3 = useActualizarEgresadoStep3({
    formData,
    setFormData,
    curpValidated,
    nextStep,
    resetStep: resetFormToStep1,
  });

  return {
    formData,
    setFormData,
    currentStep,
    curpValidated,
    loadingCurp: step1.loadingCurp,
    loadingDomicilio: step2.loadingDomicilio,
    loadingLaboral: step3.loadingLaboral,
    loadingPerfil: step1.loadingPerfil,
    uploadingImagen: step1.uploadingImagen,
    handleChange,
    handleImageUpload: step1.handleImageUpload,
    handleValidateCurp: step1.handleValidateCurp,
    handleGuardarDomicilioYContinuar: step2.handleGuardarDomicilioYContinuar,
    handleActualizarPerfilYContinuar: step1.handleActualizarPerfilYContinuar,
    handleFinalizarSoloTresEtapas: step3.handleFinalizarSoloTresEtapas,
    handleUnirseOrgulloUp: step3.handleUnirseOrgulloUp,
    handleFinalizarTodo: step3.handleFinalizarTodo,
    nextStep,
    prevStep,
  };
};
