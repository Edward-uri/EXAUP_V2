import React, { useState } from 'react';
import { User, MapPin, Briefcase, Heart, ChevronRight, ChevronLeft, Save, Check } from 'lucide-react';
import type { FormData, StepItem } from '../../../../types';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';

// Importación de componentes
import Stepper from '../components/Stepper';
import AvatarSidebar from '../components/AvatarSidebar';
import EtapaUno from '../components/steps/Etapa1';
import EtapaDos from '../components/steps/Etapa2';
import EtapaTres from '../components/steps/Etapa3';
import EtapaCuatro from '../components/steps/Etapa4';

const ActualizarEgresadoPage: React.FC = () => {
  // --- ESTADOS ---
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);
  const [loadingCurp, setLoadingCurp] = useState<boolean>(false);
  const [loadingDomicilio, setLoadingDomicilio] = useState<boolean>(false);
  const [loadingLaboral, setLoadingLaboral] = useState<boolean>(false);
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    egresadoId: undefined, curp: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNacimiento: '', email: '',
    calle: '', colonia: '', numero: '', estado: '', ciudad: '', codigoPostal: '',
    trabajaActualmente: false, empresa: '', puesto: '', sector: '', actividad: '',
    orgulloImagen: null, orgulloNombre: '', orgulloCorreo: '', orgulloCarrera: '', orgulloMensaje: ''
  });

  const steps: StepItem[] = [
    { id: 1, title: 'Datos personales', icon: <User size={18} /> },
    { id: 2, title: 'Datos domiciliarios', icon: <MapPin size={18} /> },
    { id: 3, title: 'Datos laborales', icon: <Briefcase size={18} /> },
    { id: 4, title: 'Orgullo UP', icon: <img src="/OrgUpLogo.png" alt="Orgullo UP" className="w-100 h-100 object-contain scale-300" /> }
  ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // por lo que hacemos un casting o comprobación
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, orgulloImagen: URL.createObjectURL(file) });
    }
  };

  const handleValidateCurp = async () => {
    if (formData.curp.trim().length < 10) {
      alert('Por favor, ingresa una CURP válida (mínimo 10 caracteres).');
      return;
    }

    setLoadingCurp(true);
    try {
      const auth = await ActualizarEgresadoService.login(
        formData.curp.trim().toUpperCase()
      );

      setCurpValidated(true);
      setFormData(prev => ({
        ...prev,
        egresadoId: auth.id ?? prev.egresadoId,
        nombre: auth.nombre ?? prev.nombre,
        email: auth.email ?? prev.email
      }));
    } catch (err: any) {
      setCurpValidated(false);
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      const message = apiMessage || (err instanceof Error ? err.message : 'No se pudo validar la CURP');
      alert(message);
    } finally {
      setLoadingCurp(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleGuardarDomicilioYContinuar = async () => {
    setLoadingDomicilio(true);
    try {
      await ActualizarEgresadoService.createDatosDomiciliarios({
        calle: formData.calle,
        colonia: formData.colonia,
        numero_exterior: formData.numero,
        codigo_postal: formData.codigoPostal,
        estado: formData.estado,
        ciudad: formData.ciudad
      });
      nextStep();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      const message = apiMessage || (err instanceof Error ? err.message : 'No se pudieron guardar los datos domiciliarios');
      alert(message);
    } finally {
      setLoadingDomicilio(false);
    }
  };

  const handleActualizarPerfilYContinuar = async () => {
    if (!formData.egresadoId) {
      alert('Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    setLoadingPerfil(true);
    try {
      await ActualizarEgresadoService.updatePerfil(formData.egresadoId, {
        email: formData.email || undefined,
        fecha_nacimiento: formData.fechaNacimiento || undefined,
        imagen_egresado: formData.orgulloImagen || undefined
      });
      nextStep();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      const message = apiMessage || (err instanceof Error ? err.message : 'No se pudo actualizar el perfil');
      alert(message);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleGuardarDatosLaborales = async () => {
    const sectorValue = formData.sector.trim();
    const sectorId = sectorValue ? Number(sectorValue) : null;

    if (formData.trabajaActualmente) {
      if (!formData.empresa.trim() || !formData.puesto.trim() || !formData.actividad.trim()) {
        alert('Completa empresa, puesto y actividad principal.');
        return false;
      }

      if (!sectorValue || Number.isNaN(sectorId)) {
        alert('Ingresa un ID de sector valido.');
        return false;
      }
    }

    setLoadingLaboral(true);
    try {
      await ActualizarEgresadoService.createDatosLaborales({
        trabaja_actualmente: formData.trabajaActualmente,
        nombre_empresa: formData.empresa,
        puesto: formData.puesto,
        id_sector: formData.trabajaActualmente ? sectorId : null,
        actividad_principal: formData.actividad
      });
      return true;
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      const message = apiMessage || (err instanceof Error ? err.message : 'No se pudieron guardar los datos laborales');
      alert(message);
      return false;
    } finally {
      setLoadingLaboral(false);
    }
  };

  const handleFinalizarSoloTresEtapas = async () => {
    const saved = await handleGuardarDatosLaborales();
    if (!saved) {
      return;
    }
    alert("¡Datos actualizados correctamente! (Sin Orgullo UP)");
    console.log("Enviando datos parciales:", formData);
  };

  const handleUnirseOrgulloUp = async () => {
    const saved = await handleGuardarDatosLaborales();
    if (!saved) {
      return;
    }
    if (!formData.orgulloNombre) {
        setFormData(prev => ({ 
            ...prev, 
            orgulloNombre: `${prev.nombre} ${prev.apellidoPaterno}`, 
            orgulloCorreo: prev.email 
        }));
    }
    nextStep();
  };

  const handleFinalizarTodo = () => {
    alert("¡Felicidades! Tus datos han sido actualizados y te has unido a Orgullo UP.");
    console.log("Enviando todos los datos:", formData);
  };

  const showSidebar = currentStep !== 1;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '650px' }}>
        
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="flex flex-col md:flex-row flex-1">
          {showSidebar && <AvatarSidebar imagePreview={formData.orgulloImagen} />}

          <div className={`w-full ${showSidebar ? 'md:w-2/3' : ''} p-8 flex flex-col h-full`}>
                
                <div className="flex-1">
                    {currentStep === 1 && (
                      <EtapaUno 
                        data={formData} 
                        onChange={handleChange} 
                        curpValidated={curpValidated}
                        setCurpValidated={setCurpValidated}
                        onValidateCurp={handleValidateCurp}
                        loadingCurp={loadingCurp}
                        onImageUpload={handleImageUpload}
                        centerCurp={!showSidebar}
                      />
                    )}
                    {currentStep === 2 && <EtapaDos data={formData} onChange={handleChange} />}
                    {currentStep === 3 && <EtapaTres data={formData} onChange={handleChange} setFormData={setFormData} />}
                    {currentStep === 4 && <EtapaCuatro data={formData} />}
                </div>

                <div className="bg-white px-6 py-4 border-t border-gray-100 flex justify-between items-center z-10">
                    
                    <button 
                        onClick={prevStep} 
                        disabled={currentStep === 1} 
                        className={`flex items-center gap-1 px-6 py-2 rounded-md font-medium transition-colors 
                        ${currentStep === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <ChevronLeft size={18} /> ATRÁS
                    </button>

                    <div className="flex gap-3">
                        {currentStep < 3 && (
                             <button 
                            onClick={currentStep === 1 ? handleActualizarPerfilYContinuar : currentStep === 2 ? handleGuardarDomicilioYContinuar : nextStep} 
                            disabled={(currentStep === 1 && (!curpValidated || loadingPerfil)) || (currentStep === 2 && loadingDomicilio)} 
                                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white transition-colors 
                            ${currentStep === 1 && !curpValidated 
                                    ? 'bg-blue-900/50 cursor-not-allowed' 
                                    : 'bg-blue-900 hover:bg-blue-800'}`}
                            >
                            {currentStep === 1 && loadingPerfil
                              ? 'Guardando...'
                              : currentStep === 2 && loadingDomicilio
                              ? 'Guardando...'
                              : 'SIGUIENTE'} <ChevronRight size={18} />
                            </button>
                        )}

                        {currentStep === 3 && (
                            <>
                                <button 
                                  onClick={handleFinalizarSoloTresEtapas} 
                                  disabled={loadingLaboral}
                                  className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-blue-900 border border-blue-900 hover:bg-blue-50 transition-colors disabled:opacity-50"
                                >
                                  <Save size={18} /> {loadingLaboral ? 'Guardando...' : 'Solo Guardar'}
                                </button>
                                <button 
                                  onClick={handleUnirseOrgulloUp} 
                                  disabled={loadingLaboral}
                                  className="flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white bg-gradient-to-r from-blue-900 to-indigo-800 hover:to-indigo-900 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
                                >
                                  ¡Unirme a Orgullo UP! <Heart size={18} className="fill-white" />
                                </button>
                            </>
                        )}

                        {currentStep === 4 && (
                            <button 
                                onClick={handleFinalizarTodo} 
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-8 py-2 rounded-md font-medium border border-emerald-200 shadow-sm flex items-center gap-2"
                            >
                                <Check size={18} /> FINALIZAR REGISTRO
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActualizarEgresadoPage;