import React, { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Heart, ChevronRight, ChevronLeft, Save, Check } from 'lucide-react';
import type { FormData, StepItem } from '../../../../types';
import { ActualizarEgresadoService } from '../../data/ActualizarEgresadoService';
import { useAlert } from '../../../../shared/components/Alert';
import { EgresadoFormStorageService } from '../../../../storage/service/EgresadoFormStorageService';

// Importación de componentes
import Stepper from '../components/Stepper';
import AvatarSidebar from '../components/AvatarSidebar';
import EtapaUno from '../components/steps/Etapa1';
import EtapaDos from '../components/steps/Etapa2';
import EtapaTres from '../components/steps/Etapa3';
import EtapaCuatro from '../components/steps/Etapa4';

const ActualizarEgresadoPage: React.FC = () => {
  const alert = useAlert();
  // --- ESTADOS ---
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [curpValidated, setCurpValidated] = useState<boolean>(false);
  const [loadingCurp, setLoadingCurp] = useState<boolean>(false);
  const [loadingDomicilio, setLoadingDomicilio] = useState<boolean>(false);
  const [loadingLaboral, setLoadingLaboral] = useState<boolean>(false);
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(false);
  const [domicilioId, setDomicilioId] = useState<string | null>(null);
  const [laboralId, setLaboralId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    egresadoId: undefined, curp: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNacimiento: '', email: '',
    calle: '', colonia: '', numero: '', estado: '', ciudad: '', codigoPostal: '',
    trabajaActualmente: false, empresa: '', puesto: '', sector: '', actividad: '',
    orgulloImagen: null, orgulloNombre: '', orgulloCorreo: '', orgulloCarrera: '', orgulloMensaje: ''
  });

  const getApiErrorMessage = (err: any, defaultMessage: string) => {
    const raw = err?.response?.data;
    const fromMessage = raw?.message || raw?.error || raw?.detail;

    let finalMessage: unknown = fromMessage;

    if (!finalMessage && err instanceof Error) {
      finalMessage = err.message;
    }

    if (!finalMessage) {
      return defaultMessage;
    }

    // Evitar pasar objetos directamente a React; convertirlos a string legible
    if (typeof finalMessage === 'string') {
      return finalMessage;
    }

    try {
      return JSON.stringify(finalMessage);
    } catch {
      return defaultMessage;
    }
  };

  // Cargar progreso guardado (paso actual, curp validada y campos) al montar
  useEffect(() => {
    const saved = EgresadoFormStorageService.loadState();
    if (!saved) return;
    const savedForm = saved.formData ?? {};

    // Determinar si ya tenemos datos clave para avanzar de etapa
    const hasEgresadoId = typeof savedForm.egresadoId === 'string' && savedForm.egresadoId.trim() !== '';
    const hasDomicilio = Boolean(
      savedForm.calle ||
      savedForm.colonia ||
      savedForm.numero ||
      savedForm.codigoPostal ||
      savedForm.estado ||
      savedForm.ciudad
    );

    // Restaurar bandera de CURP validada (o inferirla si ya hay egresadoId)
    const restoredCurpValidated =
      typeof saved.curpValidated === 'boolean'
        ? saved.curpValidated
        : hasEgresadoId;
    setCurpValidated(restoredCurpValidated);

    // Determinar el paso objetivo al restaurar
    let targetStep = saved.currentStep && saved.currentStep >= 1 && saved.currentStep <= 4
      ? saved.currentStep
      : 1;

    // Si ya se validó la CURP / tenemos egresadoId, no volver a la pantalla de validación
    if (restoredCurpValidated && targetStep < 2) {
      targetStep = 2;
    }

    // Si ya hay datos domiciliarios guardados, al menos estar en la etapa 3
    if (hasDomicilio && targetStep < 3) {
      targetStep = 3;
    }

    setCurrentStep(targetStep);

    if (saved.formData) {
      setFormData(prev => ({
        ...prev,
        // No restauramos orgulloImagen para evitar guardar URLs blob inválidas
        ...saved.formData,
        orgulloImagen: null,
      }));
    }
  }, []);

  // Guardar progreso cada vez que cambian el paso, la validación de CURP o los datos del formulario
  useEffect(() => {
    const { orgulloImagen, ...restFormData } = formData;
    EgresadoFormStorageService.saveState({
      currentStep,
      curpValidated,
      formData: restFormData,
    });
  }, [currentStep, curpValidated, formData]);

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

  const loadPerfilFromApi = async () => {
    try {
      const result = await ActualizarEgresadoService.getPerfilActual();
      if (!result) {
        return;
      }

      const attrs = result.attributes || {};

      setFormData(prev => ({
        ...prev,
        egresadoId: prev.egresadoId ?? result.id,
        nombre: attrs.nombre ?? prev.nombre,
        apellidoPaterno: attrs.apellido_paterno ?? attrs.primer_apellido ?? prev.apellidoPaterno,
        apellidoMaterno: attrs.apellido_materno ?? attrs.segundo_apellido ?? prev.apellidoMaterno,
        fechaNacimiento: attrs.fecha_nacimiento ?? prev.fechaNacimiento,
        email: attrs.email ?? prev.email,
        orgulloImagen: attrs.imagen_egresado ?? prev.orgulloImagen,
      }));
    } catch (err) {
      console.error('[Step1] Error al cargar perfil de egresado', err);
    }
  };

  const loadDomicilioFromApi = async () => {
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
  };

  const loadLaboralFromApi = async () => {
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
  };

  const handleValidateCurp = async () => {
    if (formData.curp.trim().length < 10) {
      alert.warning('CURP invalida', 'Por favor, ingresa una CURP valida (minimo 10 caracteres).');
      return;
    }

    setLoadingCurp(true);
    try {
      console.log('[Step1] Enviando CURP para login', formData.curp.trim().toUpperCase());
      const auth = await ActualizarEgresadoService.login(
        formData.curp.trim().toUpperCase()
      );

      console.log('[Step1] Respuesta de login CURP', auth);

      setCurpValidated(true);
      setFormData(prev => ({
        ...prev,
        egresadoId: auth.id ?? prev.egresadoId,
        nombre: auth.nombre ?? prev.nombre,
        apellidoPaterno: auth.apellidoPaterno ?? prev.apellidoPaterno,
        apellidoMaterno: auth.apellidoMaterno ?? prev.apellidoMaterno,
        fechaNacimiento: auth.fechaNacimiento ?? prev.fechaNacimiento,
        email: auth.email ?? prev.email
      }));

      // Cargar perfil completo del egresado (incluye posibles datos ya registrados)
      loadPerfilFromApi();

      // Cargar datos previamente guardados para las siguientes etapas
      loadDomicilioFromApi();
      loadLaboralFromApi();
    } catch (err: any) {
      setCurpValidated(false);
      const message = getApiErrorMessage(err, 'No se pudo validar la CURP');
      alert.error('Error al validar', message);
      console.error('[Step1] Error en login CURP', {
        status: err?.response?.status,
        data: err?.response?.data,
        config: err?.config,
      });
    } finally {
      setLoadingCurp(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleGuardarDomicilioYContinuar = async () => {
    setLoadingDomicilio(true);
    try {
      // Validar que todos los campos de la etapa 2 estén llenos
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
        // Intentar recargar para obtener el ID creado
        loadDomicilioFromApi();
      }
      nextStep();
    } catch (err: any) {
      const message = getApiErrorMessage(err, 'No se pudieron guardar los datos domiciliarios');
      alert.error('Error al guardar', message);
    } finally {
      setLoadingDomicilio(false);
    }
  };

  const handleActualizarPerfilYContinuar = async () => {
    if (!formData.egresadoId) {
      alert.warning('CURP requerida', 'Primero valida tu CURP para obtener el ID del egresado.');
      return;
    }

    // Validar que todos los campos de la etapa 1 estén llenos
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
      console.log('[Step1] Actualizando perfil egresado', {
        egresadoId: formData.egresadoId,
        payload: {
          email: formData.email || undefined,
          fecha_nacimiento: formData.fechaNacimiento || undefined,
          imagen_egresado: formData.orgulloImagen || undefined
        }
      });
      console.log('[Step1] Token actual antes de updatePerfil', {
        accessToken: localStorage.getItem('user_access_token'),
        refreshToken: localStorage.getItem('user_refresh_token'),
        egresadoId: formData.egresadoId,
      });
      await ActualizarEgresadoService.updatePerfil(formData.egresadoId, {
        email: formData.email || undefined,
        fecha_nacimiento: formData.fechaNacimiento || undefined,
        imagen_egresado: formData.orgulloImagen || undefined
      });
      console.log('[Step1] Perfil actualizado correctamente');
      nextStep();
    } catch (err: any) {
      const message = getApiErrorMessage(err, 'No se pudo actualizar el perfil');
      alert.error('Error al actualizar', message);
      console.error('[Step1] Error al actualizar perfil', {
        status: err?.response?.status,
        data: err?.response?.data,
        config: err?.config,
      });
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleGuardarDatosLaborales = async () => {
    const sectorValue = formData.sector.trim();
    const sectorId = sectorValue ? Number(sectorValue) : null;

    if (formData.trabajaActualmente) {
      // Validar que todos los campos visibles de la etapa 3 estén llenos
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
            // Trabaja actualmente: enviar los datos capturados
            trabaja_actualmente: true,
            nombre_empresa: formData.empresa,
            puesto: formData.puesto,
            id_sector: sectorId,
            actividad_principal: formData.actividad,
          }
        : {
            // No trabaja actualmente: enviar datos "vacíos" para limpiar en el backend
            trabaja_actualmente: false,
            nombre_empresa: "",
            puesto: "",
            id_sector: null,
            actividad_principal: "",
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
        // Intentar recargar para obtener el ID creado
        loadLaboralFromApi();
      }
      return true;
    } catch (err: any) {
      const message = getApiErrorMessage(err, 'No se pudieron guardar los datos laborales');
      alert.error('Error al guardar', message);
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
    EgresadoFormStorageService.clearState();
    alert.success('Datos actualizados', 'Los datos se actualizaron correctamente (sin Orgullo UP).');
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
    EgresadoFormStorageService.clearState();
    alert.success('Actualizacion completa', 'Tus datos han sido actualizados y te has unido a Orgullo UP.');
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