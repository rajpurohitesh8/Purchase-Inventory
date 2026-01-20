// src/main.jsx
import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { ClerkProvider } from '@clerk/clerk-react'
  import ErrorBoundary from './components/ErrorBoundary.jsx'
  import { ToastProvider } from './contexts/ToastContext.jsx'
  import { ThemeProvider } from './contexts/ThemeContext.jsx'

  // Import your Publishable Key
  const Clerk_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!Clerk_Key) throw new Error ("Clerk Key Required")
  

  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <ToastProvider>
          <ThemeProvider>
            <ClerkProvider publishableKey={Clerk_Key}>
              <App />
            </ClerkProvider>
          </ThemeProvider>
        </ToastProvider>
      </ErrorBoundary>
    </StrictMode>,
  )