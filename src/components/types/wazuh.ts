// src/types/wazuh.ts
export interface AgenteWazuh {
  id: string;
  name: string;
  ip: string;
  status: string;
  passedPolicies: number;
  failedPolicies: number;
  naPolicies: number;
  lastScan: string | null;
  policyName: string | null;
}

export interface FailedChecksResponse {
  failedCheckIdsTest: number[];
}

// Estructura para almacenar en FailedChecksContext
export interface AgenteConChecks {
  id: string; // ID del agente
  name: string; // Nombre del agente
  policyNameUsada?: string | null; // Política que se usó para obtener los checks
  failedChecksData?: number[]; // Array de IDs de checks fallados
  lastUpdate: Date; // Cuándo se actualizaron por última vez estos datos
  // Podrías añadir isLoading, error si quieres granularidad por agente aquí
}

// Para el NotificationContext
export interface NotificationPayload {
  id: string;
  title: string; // Ej: "Cambios en Agente X"
  message: string; // Ej: "Checks fallados: 3 -> 5. Nuevos: [101, 102]. Resueltos: [98]"
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  details?: any; // Para información adicional si es necesario
}
