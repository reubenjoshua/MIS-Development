import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { UserProvider } from './context/useAuth.tsx'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot (document.getElementById ('root')!).render (
  // <BrowserRouter>
  //   <UserProvider>
  //   </UserProvider>
  // </BrowserRouter>
      <App />
)
