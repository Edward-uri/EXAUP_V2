import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../shared/layout/Layout";
import CrearFormularioPage from "../features/formulario/presentation/pages/CrearFomularioPage";
import FormulariosPage from "../features/formulario/presentation/pages/FormulariosPage";
import PreviewFormularioPage from "../features/formulario/presentation/pages/PreviewFormularioPage";
import CrearEncuestaPage from "../features/encuesta/presentation/pages/CrearEncuestaPage";
import EncuestasPage from "../features/encuesta/presentation/pages/EncuestasPage";
import GestionarEncuestaPage from "../features/encuesta/presentation/pages/GestionarEncuestaPage";
import AnalyticsPage from "../features/metricas/presentation/pages/AnalyticsPage";
import OrgulloUpPage from "../features/orgulloUP/presentation/pages/OrgulloUpPage";
import ActualizarEgresadoPage from "../features/formularioActualizarEgresado/presentation/pages/ActualizarEgresadoPage";
import ResponderEncuestaPage from "../features/encuesta/presentation/pages/ResponderEncuestaPage";
import { ROUTES } from "../constants/routes";
import HomePage from "../features/home/presentation/pages/Home";
import LoginPage from "../features/login/presentation/pages/LoginPage";
import AcercaDePage from "../features/landing/presentation/pages/AcercaDePage";
import CursosTalleresPage from "../features/landing/presentation/pages/CursosPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  // Ruta aislada para ver la página sin el layout principal
  {
    path: "/actualizar-egresado",
    element: <ActualizarEgresadoPage />
  },
  // Ruta pública corta usada en correos
  {
    path: "/survey/:uuid",
    element: <ResponderEncuestaPage />
  },
  {
    path: "/encuestas/responder/:uuid",
    element: <ResponderEncuestaPage />
  },
  // Ruta aislada para Acerca de
  {
    path: ROUTES.ACERCA_DE,
    element: <AcercaDePage />
  },
  // Ruta aislada para Cursos
  {
    path: ROUTES.CURSOS,
    element: <CursosTalleresPage />
  },
  {
    path: "/",
    element: <DashboardLayout />, 
    children: [
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: ROUTES.ENCUESTAS,
        element: <EncuestasPage/>
      },
      {
        path: ROUTES.ENCUESTAS_CREAR,
        element: <CrearEncuestaPage/>
      },
      {
        path: "encuestas/:id/gestionar",
        element: <GestionarEncuestaPage/>
      },
      {
        path: "encuestas/:id/analytics",
        element: <AnalyticsPage/>
      },
      {
        path: ROUTES.FORMULARIOS,
        element: <FormulariosPage/>
      },
      {
        path: ROUTES.FORMULARIOS_CREAR,
        element: <CrearFormularioPage/>
      },
      {
        path: "formularios/editar/:id",
        element: <CrearFormularioPage/>
      },
      {
        path: "formularios/preview/:id",
        element: <PreviewFormularioPage/>
      },
      {
        path: ROUTES.ORGULLO_UP,
        element: <OrgulloUpPage/>
      }
    ]
  }
]);