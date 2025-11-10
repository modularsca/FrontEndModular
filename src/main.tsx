// src/main.tsx
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

import { NotificationProvider } from "./context/NotificacionContext";
import { FailedChecksProvider } from "./context/FailedCheckContext";
import { AuthProvider } from "./context/AuthContext"; // <-- 1. IMPORTAR

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <FailedChecksProvider>
        <AuthProvider>
          {" "}
          {/* <-- 2. ENVOLVER APP */}
          <App />
        </AuthProvider>
      </FailedChecksProvider>
    </NotificationProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
