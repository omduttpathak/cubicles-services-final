import React from "react"
import ReactDOM from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import App from "./App"
import "./index.css"

import { SiteSettingsProvider } from "@/context/SiteSettingsContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SiteSettingsProvider>
          <App />

          <Toaster
            richColors
            position="top-right"
            closeButton
            duration={4000}
          />
        </SiteSettingsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
