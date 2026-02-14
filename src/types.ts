// Interfaz principal de los datos del formulario
export interface FormData {
  // Etapa 1: Datos Personales
  egresadoId?: string;
  curp: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  email: string;
  
  // Etapa 2: Datos Domiciliarios
  calle: string;
  colonia: string;
  numero: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;

  // Etapa 3: Datos Laborales
  trabajaActualmente: boolean;
  empresa: string;
  puesto: string;
  sector: string;
  actividad: string;

  // Etapa 4: Orgullo UP
  orgulloImagen: string | null; // Puede ser null si no ha subido foto
  orgulloNombre: string;
  orgulloCorreo: string;
  orgulloCarrera: string;
  orgulloMensaje: string;
}

// Interfaz para los items del Stepper (la barra de arriba)
import type React from 'react';

export interface StepItem {
  id: number;
  title: string;
  icon: React.ReactNode; // ReactNode permite pasar componentes como iconos
}
