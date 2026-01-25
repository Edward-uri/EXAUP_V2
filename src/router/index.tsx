import { createBrowserRouter } from "react-router-dom";

const Home = () => <div className="p-4"><h1>Bienvenido al Dashboard</h1></div>;
import DashboardLayout from "../shared/layout/Layout";
import CrearFormularioPage from "../features/formulario/presentation/pages/CrearFomularioPage";
import FormulariosPage from "../features/formulario/presentation/pages/FormulariosPage";
import PreviewFormularioPage from "../features/formulario/presentation/pages/PreviewFormularioPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, 
    children: [
      {
        index: true, 
        element: <Home />
      },
      {
        path: "formularios",
        element: <FormulariosPage/>
      },
      {
        path: "formularios/crear",
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