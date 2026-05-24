import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.documentElement.lang = 'es'
document.documentElement.setAttribute('translate', 'no')
document.documentElement.classList.add('notranslate')
document.body.setAttribute('translate', 'no')
document.body.classList.add('notranslate')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
