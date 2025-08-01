import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App"; //
import "./index.css"; //

// Asegúrate de que las rutas de importación sean correctas
import { NotificationProvider } from "./context/NotificacionContext"; //
import { FailedChecksProvider } from "./context/FailedCheckContext"; // Asumiendo que lo tienes en src/context/

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <FailedChecksProvider>
        <App />
      </FailedChecksProvider>
    </NotificationProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
