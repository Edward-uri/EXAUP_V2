import { RouterProvider } from 'react-router-dom'
import { router } from "./router/index"
import { ToastProvider } from './shared/components/Toast'

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App