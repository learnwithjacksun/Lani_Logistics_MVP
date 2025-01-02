import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Styles/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { OrderProvider, AuthProvider, NotificationProvider } from "./Providers";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
