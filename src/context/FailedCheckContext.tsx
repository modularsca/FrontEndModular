// src/context/FailedChecksContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useNotification } from "./NotificacionContext";

interface AgentCheckData {
  agentId: string;
  agentName: string;
  policyId: string;
  failedChecks: Set<number>;
  lastUpdate: Date;
}

interface FailedChecksContextType {
  agentChecks: Map<string, AgentCheckData>;
  updateAgentFailedChecks: (
    agentId: string,
    agentName: string,
    policyId: string,
    newFailedChecks: number[],
    onDiscrepancyFound?: () => void // <--- AÑADIR ESTO
  ) => void;
  getAgentChecks: (
    agentId: string,
    policyId: string
  ) => AgentCheckData | undefined;
}

const FailedChecksContext = createContext<FailedChecksContextType | undefined>(
  undefined
);

export const FailedChecksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [agentChecks, setAgentChecks] = useState<Map<string, AgentCheckData>>(
    new Map()
  );
  const { addNotification } = useNotification();

  const updateAgentFailedChecks = useCallback(
    (
      agentId: string,
      agentName: string,
      policyId: string,
      newFailedChecksArray: number[],
      onDiscrepancyFound?: () => void // <--- AÑADIR ESTO
    ) => {
      const newFailedChecksSet = new Set(newFailedChecksArray);
      const now = new Date();
      const mapKey = `${agentId}-${policyId}`;

      setAgentChecks((prevAgentChecksMap) => {
        const newMap = new Map(prevAgentChecksMap);
        const existingAgentCheckData = newMap.get(mapKey);
        let oldFailedChecksSet = new Set<number>();
        if (existingAgentCheckData) {
          oldFailedChecksSet = existingAgentCheckData.failedChecks;
        } else {
          // Si no hay datos existentes, es la primera vez que se carga.
          // Almacenamos los datos y no hacemos nada más.
          const initialAgentCheckData: AgentCheckData = {
            agentId,
            agentName,
            policyId,
            failedChecks: newFailedChecksSet,
            lastUpdate: now,
          };
          newMap.set(mapKey, initialAgentCheckData);
          return newMap;
        }
        // ---> AQUÍ PUEDES VER LA COMPARACIÓN <---
        console.log(
          `[Checks Context] Comparing for Agent: ${agentName} (Policy: ${policyId})`
        );
        console.log(
          "[Checks Context]   Datos Anteriores (Contexto):",
          Array.from(oldFailedChecksSet)
        );
        console.log(
          "[Checks Context]   Nuevos Datos (Fetch):",
          newFailedChecksArray
        );

        // CONSOLE LOG DE DISCREPANCIA

        const newlyFailedChecks: number[] = [];
        newFailedChecksSet.forEach((checkId) => {
          if (!oldFailedChecksSet.has(checkId)) {
            newlyFailedChecks.push(checkId);
          }
        });

        const newlyPassedChecks: number[] = [];
        oldFailedChecksSet.forEach((checkId) => {
          if (!newFailedChecksSet.has(checkId)) {
            newlyPassedChecks.push(checkId);
          }
        });

        if (newlyFailedChecks.length > 0 || newlyPassedChecks.length > 0) {
          // CONSOLE.LOG PARA VER LA DISCREPANCIA CALCULADA
          console.log(`[DISCREPANCIA ENCONTRADA] Para Agente: ${agentName}`);
          console.log(
            "  -> Checks que AHORA FALLAN (nuevos):",
            newlyFailedChecks
          );
          console.log(
            "  -> Checks que YA NO FALLAN (resueltos):",
            newlyPassedChecks
          );

          // El código que ya tenías para crear y enviar la notificación
          let title = `Agente ${agentName}: Estado de Checks Modificado`;
          let details = `Política: ${policyId} - `;
          if (newlyFailedChecks.length > 0) {
            details += `Nuevos Fallados: [${newlyFailedChecks.join(", ")}]. `;
          }
          if (newlyPassedChecks.length > 0) {
            details += `Resueltos: [${newlyPassedChecks.join(", ")}].`;
          }
          addNotification(title, "warning", details);

          if (onDiscrepancyFound) {
            onDiscrepancyFound();
          }
        }

        if (newlyFailedChecks.length > 0 || newlyPassedChecks.length > 0) {
          let title = `Agente ${agentName}: Estado de Checks Modificado`;
          let details = `Política: ${policyId} - `;
          if (newlyFailedChecks.length > 0) {
            details += `Nuevos Fallados: [${newlyFailedChecks.join(", ")}]. `;
          }
          if (newlyPassedChecks.length > 0) {
            details += `Resueltos: [${newlyPassedChecks.join(", ")}].`;
          }
          addNotification(title, "warning", details);

          if (onDiscrepancyFound) {
            // <--- LLAMAR AL CALLBACK
            onDiscrepancyFound();
          }
        }

        const updatedAgentCheckData: AgentCheckData = {
          agentId,
          agentName,
          policyId,
          failedChecks: newFailedChecksSet,
          lastUpdate: now,
        };
        newMap.set(mapKey, updatedAgentCheckData);
        return newMap;
      });
    },
    [addNotification]
  );

  const getAgentChecks = useCallback(
    (agentId: string, policyId: string): AgentCheckData | undefined => {
      const mapKey = `${agentId}-${policyId}`;
      return agentChecks.get(mapKey);
    },
    [agentChecks]
  );

  return (
    <FailedChecksContext.Provider
      value={{ agentChecks, updateAgentFailedChecks, getAgentChecks }}
    >
      {children}
    </FailedChecksContext.Provider>
  );
};

export const useFailedChecks = (): FailedChecksContextType => {
  const context = useContext(FailedChecksContext);
  if (!context) {
    throw new Error(
      "useFailedChecks debe ser usado dentro de un FailedChecksProvider"
    );
  }
  return context;
};
