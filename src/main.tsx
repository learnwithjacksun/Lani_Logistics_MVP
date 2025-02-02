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

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <EmailProvider>
          <AuthProvider>
            <NotificationProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </NotificationProvider>
          </AuthProvider>
        </EmailProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
