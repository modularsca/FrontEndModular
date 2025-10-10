import React, { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWazuh } from "../../hooks/useWazuh/useWazuh";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ExclamationCircleIcon, ServerIcon, ChartBarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Interfaz para el tipo de agente
interface AgentWazuh {
  id: string;
  name: string;
  ip: string;
  status: string;
  passedPolicies: number;
  failedPolicies: number;
  naPolicies: number;
  lastScan: string | null;
  policyName: string;
}

// Frecuencia de actualización de datos históricos
const POLLING_INTERVAL_MS = 2 * 60 * 1000; // 2 minutos

const WazuhHistoricalDashboard = () => {
  const queryClient = useQueryClient();

  // Estados para el manejo de agentes y datos
  const [allAgents, setAllAgents] = useState<AgentWazuh[]>([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
  const [currentProcessingAgentId, setCurrentProcessingAgentId] = useState<string | undefined>(undefined);
  const [currentProcessingPolicyId, setCurrentProcessingPolicyId] = useState<string | undefined>(undefined);
  const [currentProcessingAgentName, setCurrentProcessingAgentName] = useState<string | undefined>(undefined);

  // Estados para almacenar los datos históricos
  const [generalHistoricalData, setGeneralHistoricalData] = useState<any[]>([]);
  const [agentHistoricalData, setAgentHistoricalData] = useState<Record<string, any[]>>({});
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isCollectingData, setIsCollectingData] = useState<boolean>(false);
  const [dataCollectionProgress, setDataCollectionProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  // Referencias para evitar re-renders innecesarios
  const collectedAgentsRef = useRef<Set<string>>(new Set());
  const isCollectingRef = useRef<boolean>(false);

  // Hook de Wazuh con los queries que me dijiste
  const {
    getAgentesQuery,
    getHistoricalFailedChecksSummaryByAgentQuery,
    getHistoricalFailedChecksSummaryGeneralQuery,
  } = useWazuh(currentProcessingAgentId, currentProcessingPolicyId);

  // Función para convertir fecha formateada a timestamp para ordenamiento
  const parseFormattedDate = useCallback((formattedData: string) => {
    const [day, month, time] = formattedData.split(" ");
    const [hour, minute] = time.split(":");
    const monthMap: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };
    const dayNum = parseInt(day) || 1;
    const monthNum = monthMap[month] || 0;
    const hourNum = parseInt(hour) || 0;
    const minuteNum = parseInt(minute) || 0;

    return new Date(2024, monthNum, dayNum, hourNum, minuteNum);
  }, []);

  // 1. OBTENER LA LISTA DE AGENTES UNA VEZ AL INICIO
  useEffect(() => {
    if (getAgentesQuery.isSuccess && getAgentesQuery.data) {
      setAllAgents(getAgentesQuery.data as AgentWazuh[]);
      collectedAgentsRef.current.clear();
      setDataCollectionProgress({ current: 0, total: getAgentesQuery.data.length });
    } else if (getAgentesQuery.isError) {
      console.error("❌ Error al obtener la lista de agentes:", getAgentesQuery.error);
    }
  }, [getAgentesQuery.data, getAgentesQuery.isSuccess, getAgentesQuery.isError]);

  // 2. OBTENER DATOS GENERALES UNA VEZ AL INICIO
  useEffect(() => {
    if (getHistoricalFailedChecksSummaryGeneralQuery.isSuccess && getHistoricalFailedChecksSummaryGeneralQuery.data) {
      const sortedGeneralData = [...getHistoricalFailedChecksSummaryGeneralQuery.data].sort(
        (a, b) => parseFormattedDate(a.formattedData).getTime() - parseFormattedDate(b.formattedData).getTime()
      );
      setGeneralHistoricalData(sortedGeneralData);
    } else if (getHistoricalFailedChecksSummaryGeneralQuery.isError) {
      console.error("❌ Error al obtener datos generales:", getHistoricalFailedChecksSummaryGeneralQuery.error);
    }
  }, [
    getHistoricalFailedChecksSummaryGeneralQuery.data,
    getHistoricalFailedChecksSummaryGeneralQuery.isSuccess,
    getHistoricalFailedChecksSummaryGeneralQuery.isError,
    parseFormattedDate,
  ]);

  // 3. FUNCIÓN QUE INICIA EL CICLO DE RECOLECCIÓN DE DATOS HISTÓRICOS POR AGENTE
  const startDataCollection = useCallback(() => {
    if (allAgents.length > 0 && !isCollectingRef.current) {
      setIsCollectingData(true);
      isCollectingRef.current = true;
      setCurrentAgentIndex(0);
      collectedAgentsRef.current.clear();
      setDataCollectionProgress({ current: 0, total: allAgents.length });

      // Invalidar queries para obtener datos frescos
      queryClient.invalidateQueries({ queryKey: ["historicalFailedChecksSummaryByAgent"] });
      queryClient.invalidateQueries({ queryKey: ["historicalFailedChecksSummaryGeneral"] });
    }
  }, [allAgents, queryClient]);

  // 4. CONFIGURAR EL INTERVALO DE ACTUALIZACIÓN
  useEffect(() => {
    // Iniciar la primera recolección
    if (allAgents.length > 0) {
      startDataCollection();
    }

    // Configurar intervalo para actualizaciones periódicas
    const intervalId = setInterval(() => {
      if (!isCollectingRef.current) {
        startDataCollection();
      }
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [startDataCollection, allAgents]);

  // 5. LÓGICA DE ITERACIÓN POR AGENTES
  useEffect(() => {
    if (allAgents.length > 0 && currentAgentIndex < allAgents.length && isCollectingRef.current) {
      const agent = allAgents[currentAgentIndex];
      const policyIdToUse = agent.policyName;

      if (agent && policyIdToUse && !collectedAgentsRef.current.has(agent.id)) {
        setCurrentProcessingAgentId(agent.id);
        setCurrentProcessingPolicyId(policyIdToUse);
        setCurrentProcessingAgentName(agent.name);
      } else {
        // Si ya se procesó este agente, continuar con el siguiente
        setCurrentAgentIndex((prevIndex) => prevIndex + 1);
      }
    } else if (currentAgentIndex >= allAgents.length && isCollectingRef.current) {
      setIsCollectingData(false);
      isCollectingRef.current = false;
      setCurrentProcessingAgentId(undefined);
      setCurrentProcessingPolicyId(undefined);
      setCurrentProcessingAgentName(undefined);
    }
  }, [allAgents, currentAgentIndex]);

  // 6. EFECTO QUE REACCIONA A LOS DATOS HISTÓRICOS POR AGENTE
  useEffect(() => {
    if (
      getHistoricalFailedChecksSummaryByAgentQuery.isFetched &&
      currentProcessingAgentId &&
      !collectedAgentsRef.current.has(currentProcessingAgentId)
    ) {
      if (getHistoricalFailedChecksSummaryByAgentQuery.isSuccess && getHistoricalFailedChecksSummaryByAgentQuery.data) {
        // Ordenar datos por fecha
        const sortedHistoricalData = [...getHistoricalFailedChecksSummaryByAgentQuery.data].sort(
          (a, b) => parseFormattedDate(a.formattedData).getTime() - parseFormattedDate(b.formattedData).getTime()
        );

        // Almacenar datos del agente
        setAgentHistoricalData((prev) => ({
          ...prev,
          [currentProcessingAgentId]: sortedHistoricalData,
        }));

        // Marcar agente como procesado
        collectedAgentsRef.current.add(currentProcessingAgentId);
        setDataCollectionProgress((prev) => ({ ...prev, current: prev.current + 1 }));
      } else if (getHistoricalFailedChecksSummaryByAgentQuery.isError) {
        console.error(
          `❌ Error al obtener datos históricos para agente ${currentProcessingAgentName}:`,
          getHistoricalFailedChecksSummaryByAgentQuery.error
        );

        // Marcar como procesado aunque haya error para no bloquear el flujo
        collectedAgentsRef.current.add(currentProcessingAgentId);
        setDataCollectionProgress((prev) => ({ ...prev, current: prev.current + 1 }));
      }

      // Continuar con el siguiente agente
      setCurrentAgentIndex((prevIndex) => prevIndex + 1);
    }
  }, [
    getHistoricalFailedChecksSummaryByAgentQuery.isFetched,
    getHistoricalFailedChecksSummaryByAgentQuery.isSuccess,
    getHistoricalFailedChecksSummaryByAgentQuery.isError,
    getHistoricalFailedChecksSummaryByAgentQuery.data,
    currentProcessingAgentId,
    currentProcessingAgentName,
    parseFormattedDate,
  ]);

  // Función para refrescar datos manualmente
  const handleRefresh = useCallback(() => {
    if (!isCollectingRef.current) {
      startDataCollection();
    }
  }, [startDataCollection]);

  if (getAgentesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando agentes de Wazuh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Histórico Wazuh</h1>
              <p className="text-gray-600">Datos históricos de checks fallidos generales y por agente</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isCollectingData}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isCollectingData
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${isCollectingData ? "animate-spin" : ""}`} />
              {isCollectingData ? "Recolectando..." : "Actualizar"}
            </button>
          </div>

          {/* Barra de progreso */}
          {isCollectingData && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Recolectando datos históricos por agente</span>
                <span>
                  {dataCollectionProgress.current}/{dataCollectionProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dataCollectionProgress.current / dataCollectionProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Gráfica General */}
        {generalHistoricalData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Resumen General Histórico de Checks Fallidos</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generalHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedData" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalFailedCount"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                    name="Total Checks Fallidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Lista de Agentes */}
        {allAgents.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <ServerIcon className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Agentes Monitoreados ({Object.keys(agentHistoricalData).length}/{allAgents.length} con datos)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allAgents.map((agent) => {
                const hasData = agentHistoricalData[agent.id]?.length > 0;
                const isProcessing = currentProcessingAgentId === agent.id;

                return (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAgent === agent.id
                        ? "border-blue-500 bg-blue-50"
                        : hasData
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-100 bg-gray-50"
                    } ${!hasData ? "cursor-not-allowed" : ""}`}
                    onClick={() => hasData && setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${hasData ? "text-gray-800" : "text-gray-400"}`}>{agent.name}</h3>
                      <div className="flex items-center space-x-1">
                        {isProcessing && (
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            agent.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm mb-1 ${hasData ? "text-gray-600" : "text-gray-400"}`}>ID: {agent.id}</p>
                    <p className={`text-sm mb-1 ${hasData ? "text-gray-600" : "text-gray-400"}`}>IP: {agent.ip}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <ExclamationCircleIcon
                          className={`w-4 h-4 mr-1 ${hasData ? "text-red-500" : "text-gray-400"}`}
                        />
                        <span className={hasData ? "text-red-600" : "text-gray-400"}>
                          {agent.failedPolicies || 0} fallos
                        </span>
                      </div>
                      {!hasData && !isProcessing && <span className="text-xs text-gray-400">Sin datos</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gráfica por Agente Seleccionado */}
        {selectedAgent && agentHistoricalData[selectedAgent] && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <ExclamationCircleIcon className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Histórico de Checks Fallidos - Agente {selectedAgent}
              </h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                {allAgents.find((a) => a.id === selectedAgent)?.name} -{" "}
                {allAgents.find((a) => a.id === selectedAgent)?.ip}
              </p>
              <p className="text-sm text-gray-500">
                {agentHistoricalData[selectedAgent].length} puntos de datos históricos
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agentHistoricalData[selectedAgent]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedData" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="failedChecksCount"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                    name="Checks Fallidos del Agente"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Información del Estado */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Estado del Dashboard:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <strong>Agentes Totales:</strong> {allAgents.length}
            </div>
            <div>
              <strong>Agentes con Datos:</strong> {Object.keys(agentHistoricalData).length}
            </div>
            <div>
              <strong>Estado:</strong> {isCollectingData ? "Recolectando datos..." : "Listo"}
            </div>
          </div>
          {currentProcessingAgentName && (
            <div className="mt-2 text-sm text-blue-600">
              <strong>Procesando:</strong> {currentProcessingAgentName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WazuhHistoricalDashboard;
