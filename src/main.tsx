import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CourseProvider } from './contexts/CourseContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CourseProvider>
        <App />
      </CourseProvider>
    </ErrorBoundary>
  </StrictMode>,
)
