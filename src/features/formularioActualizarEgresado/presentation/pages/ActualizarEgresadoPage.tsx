import React from 'react';
import { User, MapPin, Briefcase, Heart, ChevronRight, ChevronLeft, Check, Award } from 'lucide-react';
import type { StepItem } from '../types';
import { useActualizarEgresadoForm } from '../hooks/useActualizarEgresadoForm';
import Header from '../../../../shared/components/LandingHeader/Header';

// Importación de componentes
import Stepper from '../components/Stepper';
import AvatarSidebar from '../components/AvatarSidebar';
import EtapaUno from '../components/steps/Etapa1';
import EtapaDos from '../components/steps/Etapa2';
import EtapaTres from '../components/steps/Etapa3';
import EtapaCuatro from '../components/steps/Etapa4';

const ActualizarEgresadoPage: React.FC = () => {
  const {
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
  } = useActualizarEgresadoForm();

  const steps: StepItem[] = [
    { id: 1, title: 'Identidad', icon: <User size={18} /> },
    { id: 2, title: 'Dirección', icon: <MapPin size={18} /> },
    { id: 3, title: 'Laboral', icon: <Briefcase size={18} /> },
    { id: 4, title: 'Orgullo UP', icon: <Award size={18} /> }
  ];
  
  const showSidebar = currentStep !== 1;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans bg-slate-50 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200/50 rounded-[2rem] overflow-hidden flex flex-col relative z-10" style={{ minHeight: '700px' }}>
        
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="flex flex-col md:flex-row flex-1">
          {showSidebar && <AvatarSidebar imagePreview={formData.orgulloImagen} />}

          <div className={`w-full ${showSidebar ? 'md:w-2/3' : ''} p-6 md:p-10 flex flex-col h-full bg-white`}>
                
                <div className="flex-1 pb-10">
                    {currentStep === 1 && (
                      <EtapaUno 
                        data={formData} 
                        onChange={handleChange} 
                        curpValidated={curpValidated}
                        onValidateCurp={handleValidateCurp}
                        loadingCurp={loadingCurp}
                        onImageUpload={handleImageUpload}
                        centerCurp={!showSidebar}
                        isUploadingImage={uploadingImagen}
                      />
                    )}
                    {currentStep === 2 && <EtapaDos data={formData} onChange={handleChange} />}
                    {currentStep === 3 && <EtapaTres data={formData} onChange={handleChange} setFormData={setFormData} />}
                    {currentStep === 4 && <EtapaCuatro data={formData} />}
                </div>

                <div className="bg-white/90 backdrop-blur-sm px-6 py-5 border-t border-slate-100 flex justify-between items-center z-20 sticky bottom-0 -mx-6 md:-mx-10 mt-auto rounded-b-[2rem]">
                    
                    <button 
                        onClick={prevStep} 
                        disabled={currentStep === 1} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wide text-sm transition-all duration-300
                        ${currentStep === 1 
                            ? 'opacity-0 pointer-events-none' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
                    >
                        <ChevronLeft size={18} strokeWidth={2.5} /> Volver
                    </button>

                    <div className="flex gap-3 items-center">
                        {currentStep < 3 && (
                             <button 
                            onClick={currentStep === 1 ? handleActualizarPerfilYContinuar : currentStep === 2 ? handleGuardarDomicilioYContinuar : nextStep} 
                            disabled={(currentStep === 1 && (!curpValidated || loadingPerfil)) || (currentStep === 2 && loadingDomicilio)} 
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-300 shadow-md 
                            ${currentStep === 1 && !curpValidated 
                                    ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                            >
                            {currentStep === 1 && loadingPerfil
                              ? 'Guardando...'
                              : currentStep === 2 && loadingDomicilio
                              ? 'Guardando...'
                              : 'Continuar'} <ChevronRight size={18} strokeWidth={2.5} />
                            </button>
                        )}

                        {currentStep === 3 && (
                            <>
                                <button 
                                  onClick={handleFinalizarSoloTresEtapas} 
                                  disabled={loadingLaboral}
                                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                  {loadingLaboral ? 'Guardando...' : 'Finalizar Aquí'}
                                </button>
                                <button 
                                  onClick={handleUnirseOrgulloUp} 
                                  disabled={loadingLaboral}
                                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                  Siguiente: Orgullo UP <Heart size={16} className="fill-white" />
                                </button>
                            </>
                        )}

                        {currentStep === 4 && (
                            <button 
                                onClick={handleFinalizarTodo} 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-emerald-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <Check size={18} strokeWidth={2.5} /> Terminar Registro
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ActualizarEgresadoPage;