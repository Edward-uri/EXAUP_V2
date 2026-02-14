import type React from 'react';

export type FormData = {
  egresadoId?: string;
  curp: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  email: string;

  calle: string;
  colonia: string;
  numero: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;

  trabajaActualmente: boolean;
  empresa: string;
  puesto: string;
  sector: string;
  actividad: string;

  orgulloImagen: string | null;
  orgulloNombre: string;
  orgulloCorreo: string;
  orgulloCarrera: string;
  orgulloMensaje: string;
};

export type StepItem = {
  id: number;
  title: string;
  icon: React.ReactNode;
};
