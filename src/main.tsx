import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Get redirect URLs from environment variables
const SIGN_IN_FORCE_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
const SIGN_UP_FORCE_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      signInForceRedirectUrl={SIGN_IN_FORCE_REDIRECT_URL}
      signUpForceRedirectUrl={SIGN_UP_FORCE_REDIRECT_URL}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)