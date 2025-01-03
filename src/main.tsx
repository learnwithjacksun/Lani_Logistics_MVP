import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Styles/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import {
  OrderProvider,
  AuthProvider,
  NotificationProvider,
  EmailProvider,
} from "./Providers";
import { initOneSignal } from './utils/oneSignal';
import { HelmetProvider } from 'react-helmet-async';

// Initialize OneSignal
initOneSignal();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <EmailProvider>
          <NotificationProvider>
            <AuthProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </AuthProvider>
          </NotificationProvider>
        </EmailProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
