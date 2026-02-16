import { RouterProvider } from 'react-router-dom'
import { router } from "./router/index"
import { AlertProvider } from './shared/components/Alert'

function App() {
  return (
    <AlertProvider>
      <RouterProvider router={router} />
    </AlertProvider>
  )
}

export default App