import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../shared/layout/Layout";
import CrearFormularioPage from "../features/formulario/presentation/pages/CrearFomularioPage";
import FormulariosPage from "../features/formulario/presentation/pages/FormulariosPage";
import PreviewFormularioPage from "../features/formulario/presentation/pages/PreviewFormularioPage";
import CrearEncuestaPage from "../features/encuesta/presentation/pages/CrearEncuestaPage";
import EncuestasPage from "../features/encuesta/presentation/pages/EncuestasPage";
import GestionarEncuestaPage from "../features/encuesta/presentation/pages/GestionarEncuestaPage";
import { ROUTES } from "../constants/routes";
import HomePage from "../features/home/presentation/pages/Home";

export const router = createBrowserRouter([
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
      }
    ]
  }
]);