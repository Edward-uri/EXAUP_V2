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
import { ROUTES } from "../constants/routes";
import HomePage from "../features/home/presentation/pages/Home";

export const router = createBrowserRouter([
  // Ruta aislada para ver la página sin el layout principal
  {
    path: "/actualizar-egresado",
    element: <ActualizarEgresadoPage />
  },
  {
    path: "/",
    element: <DashboardLayout />, 
    children: [
      {
        index: true, 
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