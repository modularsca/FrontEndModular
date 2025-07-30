import React, { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWazuh } from "../../hooks/useWazuh/useWazuh"; //

import { useNotification } from "../../context/NotificacionContext"; //
import { useFailedChecks } from "../../context/FailedCheckContext";

// Frecuencia con la que se revisarán los checks de TODOS los agentes
const POLLING_INTERVAL_MS = 1 * 10 * 1000; // 1 minuto para pruebas

const PollingOrchestrator: React.FC = () => {
  const queryClient = useQueryClient();
  const { updateAgentFailedChecks } = useFailedChecks();
  // ESTAS DOS VARIABLES AHORA SÍ SE UTILIZARÁN
  const { addNotification } = useNotification();
  const previousCveProbsRef = useRef<Map<string, Map<string, any>>>(new Map());

  const [allAgents, setAllAgents] = useState<any[]>([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
  const [currentProcessingAgentId, setCurrentProcessingAgentId] = useState<
    string | undefined
  >(undefined);
  const [currentProcessingPolicyId, setCurrentProcessingPolicyId] = useState<
    string | undefined
  >(undefined);
  const [currentProcessingAgentName, setCurrentProcessingAgentName] = useState<
    string | undefined
  >(undefined);

  const { getAgentesQuery, getChecksFalladosQuery, getCveProbsQuery } =
    useWazuh(currentProcessingAgentId, currentProcessingPolicyId);

  // --- FUNCIÓN PARA PROCESAR Y NOTIFICAR CAMBIOS DE CVEs ---
  // Esta función es la que usa `addNotification` y `previousCveProbsRef`.
  const processAndNotifyCveProbabilities = useCallback(
    (
      agentId: string,
      agentName: string,
      policyId: string,
      newCveProbs: { cveId: string; probability: number }[] | undefined
    ) => {
      if (!newCveProbs) return;

      const newCveMap = new Map<
        string,
        { cveId: string; probability: number }
      >();
      newCveProbs.forEach((cve) => newCveMap.set(cve.cveId, cve));

      const agentPolicyKey = `${agentId}-${policyId}`;
      const oldCveMap =
        previousCveProbsRef.current.get(agentPolicyKey) || new Map();

      // Si el mapa de CVEs previos para esta clave está vacío, es la primera vez que se carga.
      // En este caso, solo almacenamos los datos actuales y no notificamos.
      if (oldCveMap.size === 0) {
        previousCveProbsRef.current.set(agentPolicyKey, newCveMap);
        return; // No notificar en la primera carga de datos para esta clave.
      }

      let cveChangesDetected = false;
      let cveChangeDetails = `Agente ${agentName} (Política ${policyId}): `;
      const addedOrChanged: string[] = [];
      newCveMap.forEach((newCve, cveId) => {
        const oldCve = oldCveMap.get(cveId);
        if (!oldCve || oldCve.probability !== newCve.probability) {
          addedOrChanged.push(`${cveId} (Prob: ${newCve.probability}%)`);
          cveChangesDetected = true;
        }
      });

      const removed: string[] = [];
      oldCveMap.forEach((_oldCve, cveId) => {
        if (!newCveMap.has(cveId)) {
          removed.push(cveId);
          cveChangesDetected = true;
        }
      });

      if (cveChangesDetected) {
        if (addedOrChanged.length > 0)
          cveChangeDetails += `CVEs Nuevos/Modificados: ${addedOrChanged.join(
            "; "
          )}. `;
        if (removed.length > 0)
          cveChangeDetails += `CVEs Removidos: ${removed.join("; ")}. `;
        // Uso de addNotification
        addNotification(
          "Cambios en Probabilidades de CVEs",
          "info",
          cveChangeDetails
        );
      }
      // Uso de previousCveProbsRef
      previousCveProbsRef.current.set(agentPolicyKey, newCveMap);
    },
    [addNotification, previousCveProbsRef]
  );

  // --- LÓGICA DEL POLLING ---

  // 1. OBTENER LA LISTA DE AGENTES UNA VEZ
  useEffect(() => {
    if (getAgentesQuery.isSuccess && getAgentesQuery.data) {
      setAllAgents(getAgentesQuery.data);
      setCurrentAgentIndex(0);
    } else if (getAgentesQuery.isError) {
      console.error(
        "Error al obtener la lista de agentes inicial:",
        getAgentesQuery.error
      );
    }
  }, [
    getAgentesQuery.data,
    getAgentesQuery.isSuccess,
    getAgentesQuery.isError,
  ]);

  // 2. FUNCIÓN QUE INICIA EL CICLO DE POLLING DE CHECKS
  const startCheckPollingCycle = useCallback(() => {
    if (allAgents.length > 0) {
      console.log(
        `💠💠💠💠💠💠💠💠 Iniciando ciclo de polling para los agentes 💠💠💠💠💠💠💠💠`
      );
      setCurrentAgentIndex(0);
      // INVALIDAR LAS CONSULTAS DE CHECKS FALLADOS PARA OBTENER NUEVAS
      queryClient.invalidateQueries({ queryKey: ["checksFallados"] });
    }
  }, [allAgents]);

  // 3. CONFIGURAR EL INTERVALO
  useEffect(() => {
    const intervalId = setInterval(startCheckPollingCycle, POLLING_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [startCheckPollingCycle]);

  // 4. LÓGICA DE ITERACIÓN
  useEffect(() => {
    if (allAgents.length > 0 && currentAgentIndex < allAgents.length) {
      const agent = allAgents[currentAgentIndex];
      const policyIdToUse = agent.policyName;

      if (agent && policyIdToUse) {
        setCurrentProcessingAgentId(agent.id);
        setCurrentProcessingPolicyId(policyIdToUse);
        setCurrentProcessingAgentName(agent.name);
      } else {
        setCurrentAgentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [allAgents, currentAgentIndex]);

  // 5. EFECTO QUE REACCIONA A LOS DATOS DE CHECKS FALLADOS
  useEffect(() => {
    if (getChecksFalladosQuery.isFetched && currentProcessingAgentId) {
      if (getChecksFalladosQuery.isSuccess && getChecksFalladosQuery.data) {
        updateAgentFailedChecks(
          currentProcessingAgentId,
          currentProcessingAgentName!,
          currentProcessingPolicyId!,
          getChecksFalladosQuery.data,
          () => {
            queryClient.invalidateQueries({
              queryKey: [
                "cveProbs",
                currentProcessingAgentId,
                currentProcessingPolicyId,
              ],
            });
          }
        );
      }
      setCurrentAgentIndex((prevIndex) => prevIndex + 1);
    }
  }, [getChecksFalladosQuery.isFetched, currentProcessingAgentId]); // Dependencias simplificadas

  // 6. EFECTO QUE REACCIONA A LOS DATOS DE CVEs (AHORA COMPLETO)
  useEffect(() => {
    if (
      getCveProbsQuery.isSuccess &&
      getCveProbsQuery.data &&
      currentProcessingAgentId
    ) {
      // LLAMA A LA FUNCIÓN QUE USA LAS VARIABLES
      processAndNotifyCveProbabilities(
        currentProcessingAgentId,
        currentProcessingAgentName!,
        currentProcessingPolicyId!,
        getCveProbsQuery.data
      );
    } else if (getCveProbsQuery.isError && currentProcessingAgentName) {
      console.error(
        `❌ Error al obtener probabilidades de CVE para ${currentProcessingAgentName}:`,
        getCveProbsQuery.error
      );
      // TAMBIÉN SE USA AQUÍ PARA NOTIFICAR ERRORES
      addNotification(
        "Error en CVEs",
        "error",
        `No se pudieron obtener datos de CVE para ${currentProcessingAgentName}.`
      );
    }
  }, [
    getCveProbsQuery.data, // Reacciona cuando los datos de CVE llegan
    getCveProbsQuery.isSuccess,
    getCveProbsQuery.isError,
    currentProcessingAgentId,
    currentProcessingAgentName,
    currentProcessingPolicyId,
    processAndNotifyCveProbabilities,
    addNotification,
  ]);

  return null;
};

export default PollingOrchestrator;
