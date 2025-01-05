import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Importa el Devtools
import App from './App';
import './index.css';

// Configura el QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
        {/* Agrega el Devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);
