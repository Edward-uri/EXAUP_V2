import { useState, useEffect } from 'react';
import { GrupoService } from '../../data/GrupoService';
import { EgresadoService } from '../../data/EgresadoService';
import type { FiltrosImportacion, ProgramaEducativo, Cohorte, Egresado } from '../../domain/Egresado';
import { useAlert } from '../../../../shared/components/Alert';

export function useCrearGrupoWizard() {
    const [step, setStep] = useState(1);
    const alert = useAlert();
    
    // Step 1: Info Básica
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    
    // Step 2: Filtros
    const [filtros, setFiltros] = useState<FiltrosImportacion>({});
    const [programas, setProgramas] = useState<ProgramaEducativo[]>([]);
    const [cohortes, setCohortes] = useState<Cohorte[]>([]);
    
    // Step 3: Preview
    const [egresadosPreview, setEgresadosPreview] = useState<Egresado[]>([]);
    const [totalMatches, setTotalMatches] = useState(0);
    const [loadingPreview, setLoadingPreview] = useState(false);
    
    // Step 4: Status
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        EgresadoService.getProgramasEducativos()
            .then(setProgramas)
            .catch(console.error);
        EgresadoService.getCohortes()
            .then(setCohortes)
            .catch(console.error);
    }, []);

    const fetchPreview = async () => {
        setLoadingPreview(true);
        try {
            const response = await EgresadoService.getEgresados(filtros, 1, 20);
            setEgresadosPreview(response.data);
            setTotalMatches(response.meta.total);
        } catch (error) {
            console.error('Error fetching preview:', error);
            alert.error('Error', 'No se pudieron cargar los egresados');
        } finally {
            setLoadingPreview(false);
        }
    };

    const nextStep = () => {
        if (step === 2) {
            fetchPreview();
        }
        setStep(s => s + 1);
    };
    
    const prevStep = () => setStep(s => s - 1);

    const submit = async () => {
        setIsSubmitting(true);
        try {
            const grupo = await GrupoService.create({
                data: {
                    type: 'grupos',
                    attributes: { nombre, descripcion }
                }
            });
            
            await GrupoService.importMembers(grupo.id, filtros);
            alert.success('Éxito', 'Grupo creado e importación completada');
            return true;
        } catch (error) {
            console.error('Error en creación/importación:', error);
            alert.error('Error', 'Hubo un problema al crear el grupo o importar miembros');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step,
        nextStep,
        prevStep,
        nombre, setNombre,
        descripcion, setDescripcion,
        filtros, setFiltros,
        programas,
        cohortes,
        egresadosPreview,
        totalMatches,
        loadingPreview,
        submit,
        isSubmitting
    };
}