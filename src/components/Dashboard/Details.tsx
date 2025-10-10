import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useWazuh } from "../../hooks/useWazuh/useWazuh";
import { DonutChart } from "../General/DonutChart";
import {
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  WifiIcon,
  BoltSlashIcon,
} from "@heroicons/react/24/solid";

export default function Details() {
  interface Check {
    id: string;
    result: "passed" | "failed" | "NA" | "not applicable" | string;
    title: string;
    description?: string;
    remediation?: string;
    policyId?: string;
  }

  const { id: agentId } = useParams();
  const { getPolicyChecks, getAgentesQuery } = useWazuh();

  const { data: checksRaw, isLoading, error } = getPolicyChecks(agentId || "", "laboratorio_computo_windows");
  const checks: Check[] = checksRaw || [];
  const agentes = getAgentesQuery.data;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const agente = agentes?.find((a) => a.id === agentId);
  const agentName = agente?.name || agentId;
  const agenteInfo = agente;

  // Reset page and expanded row when checks or agent changes
  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [checks, agentId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-600 animate-pulse">Cargando datos...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Error: {(error as Error).message}</p>
      </div>
    );

  if (!checks.length)
    return (
      <div className="p-6">
        <p className="text-gray-600">No hay datos para este agente.</p>
      </div>
    );

  const passed = checks.filter((c) => c.result === "passed").length;
  const failed = checks.filter((c) => c.result === "failed").length;
  const na = checks.filter((c) => c.result === "NA" || c.result === "not applicable").length;

  const totalApplicable = passed + failed;
  const score = totalApplicable > 0 ? Math.round((passed / totalApplicable) * 100) : 0;

  const donutData = [
    { label: "Passed", value: passed, color: "#4CAF50" },
    { label: "Failed", value: failed, color: "#F44336" },
    { label: "N/A", value: na, color: "#9E9E9E" },
  ];

  const policyId = checks[0]?.policyId || "Política desconocida";

  const totalPages = Math.ceil(checks.length / itemsPerPage);

  // Slice checks for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChecks = checks.slice(startIndex, endIndex);

  const getIcon = (result: string) => {
    if (result === "passed") return <CheckCircleIcon className="h-5 w-5 text-green-600 inline" aria-label="Passed" />;
    if (result === "failed") return <XCircleIcon className="h-5 w-5 text-red-600 inline" aria-label="Failed" />;
    return <MinusCircleIcon className="h-5 w-5 text-gray-500 inline" aria-label="N/A" />;
  };

  // Estado visual para el agente (conectado o desconectado)
  const getStatusVisual = (status?: string | null) => {
    if (!status) {
      return {
        label: "Desconocido",
        bg: "bg-gray-200",
        color: "text-gray-700",
        icon: <MinusCircleIcon className="h-5 w-5 inline mr-1" />,
      };
    }
    if (status.toLowerCase() === "connected" || status.toLowerCase() === "online") {
      return {
        label: "Conectado",
        bg: "bg-green-100",
        color: "text-green-700",
        icon: <WifiIcon className="h-5 w-5 inline mr-1" />,
      };
    }
    return {
      label: "Desconectado",
      bg: "bg-red-100",
      color: "text-red-700",
      icon: <BoltSlashIcon className="h-5 w-5 inline mr-1" />,
    };
  };

  // Estado visual para el ultimo escaneo, segun horas
  const getLastScanVisual = (lastScan?: string | null) => {
    if (!lastScan) {
      return { text: "N/A", bg: "bg-gray-200", color: "text-gray-600" };
    }
    const lastDate = new Date(lastScan);
    if (isNaN(lastDate.getTime())) {
      return { text: "Fecha inválida", bg: "bg-yellow-100", color: "text-yellow-800" };
    }

    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 24) {
      return { text: lastDate.toLocaleString(), bg: "bg-red-100", color: "text-red-700" };
    }
    if (diffHours > 5) {
      return { text: lastDate.toLocaleString(), bg: "bg-yellow-100", color: "text-yellow-700" };
    }
    return { text: lastDate.toLocaleString(), bg: "bg-green-100", color: "text-green-700" };
  };

  const statusVisual = getStatusVisual(agenteInfo?.status ?? null);
  const lastScanVisual = getLastScanVisual(agenteInfo?.lastScan ?? undefined);

  // Maneja cambio de página y reset de fila expandida
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setExpandedId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <Link to="/Dashboard" className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors">
        ← Regresar al Dashboard
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Detalles del agente <span className="text-blue-600">{agentName}</span> ({agentId})
        </h1>
        <p className="text-gray-700 text-base sm:text-lg">
          Política activa: <span className="font-semibold">{policyId}</span>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Donut Chart y resumen */}
        <article className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">{policyId}</h2>
          <DonutChart category="label" value="value" data={donutData} />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-sm font-semibold text-gray-700">
            <div className="bg-green-50 rounded-lg py-2 flex flex-col items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <p className="text-green-700 mt-1">Pasados</p>
              <p className="text-green-900 text-lg font-bold">{passed}</p>
            </div>
            <div className="bg-red-50 rounded-lg py-2 flex flex-col items-center">
              <XCircleIcon className="h-6 w-6 text-red-600" />
              <p className="text-red-700 mt-1">Fallidos</p>
              <p className="text-red-900 text-lg font-bold">{failed}</p>
            </div>
            <div className="bg-gray-100 rounded-lg py-2 flex flex-col items-center">
              <MinusCircleIcon className="h-6 w-6 text-gray-500" />
              <p className="text-gray-600 mt-1">N/A</p>
              <p className="text-gray-800 text-lg font-bold">{na}</p>
            </div>
          </div>
          <div className="mt-6 bg-blue-50 text-blue-900 rounded-full px-6 py-3 font-bold text-xl w-32">
            Score: {score}%
          </div>
          <dl className="mt-6 text-left w-full space-y-4 text-gray-700">
            <div>
              <dt className="font-semibold">Estado</dt>
              <dd
                className={`w-1/2 flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${statusVisual.bg} ${statusVisual.color}`}
              >
                {statusVisual.icon}
                <span>{statusVisual.label}</span>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Último escaneo</dt>
              <dd className={`rounded px-2 py-1 font-medium inline-block ${lastScanVisual.bg} ${lastScanVisual.color}`}>
                {lastScanVisual.text}
              </dd>
            </div>
          </dl>
        </article>

        {/* Tabla */}
        <section className="md:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados de las políticas ({policyId})</h2>

          <table className="min-w-full border-separate border-spacing-y-4 text-gray-800">
            <thead>
              <tr className="bg-gray-100 rounded-lg">
                <th className="text-left px-3 sm:px-6 py-3 font-semibold w-20 rounded-tl-lg whitespace-nowrap">ID</th>
                <th className="text-left px-3 sm:px-6 py-3 font-semibold w-32 whitespace-nowrap">Resultado</th>
                <th className="text-left px-3 sm:px-6 py-3 font-semibold">Título</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody key={`page-${currentPage}`}>
              {paginatedChecks.map((check) => {
                const isExpanded = expandedId === check.id;
                const resultBg =
                  check.result === "passed" ? "bg-green-100" : check.result === "failed" ? "bg-red-100" : "bg-gray-200";

                const resultTextColor =
                  check.result === "passed"
                    ? "text-green-700"
                    : check.result === "failed"
                    ? "text-red-700"
                    : "text-gray-700";

                return (
                  <React.Fragment key={check.id}>
                    <tr
                      className="bg-white shadow-sm hover:shadow-md cursor-pointer rounded-lg transition"
                      onClick={() => setExpandedId(isExpanded ? null : check.id)}
                    >
                      <td className="px-3 sm:px-6 py-4 align-top font-mono text-sm whitespace-nowrap">{check.id}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`${resultBg} ${resultTextColor} inline-flex items-center justify-center rounded-full px-3 py-1 font-semibold text-sm select-none`}
                        >
                          {getIcon(check.result)}
                          <span className="ml-2 capitalize">{check.result}</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 align-top">{check.title}</td>
                      <td className="px-3 sm:px-6 py-4 text-right text-gray-400 select-none w-12 whitespace-nowrap">
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5 inline" aria-label="Cerrar detalles" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 inline" aria-label="Abrir detalles" />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50 rounded-b-lg">
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-700 transition-opacity duration-300">
                          <p className="mb-2">
                            <strong>Descripción:</strong> {check.description || "No disponible"}
                          </p>
                          <p>
                            <strong>Remediación:</strong> {check.remediation || "No disponible"}
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <nav aria-label="Paginación" className="mt-6 flex justify-center items-center gap-2 text-gray-700 flex-wrap">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Primera página"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Página anterior"
            >
              Anterior
            </button>

            {/* Botones numéricos */}
            {(() => {
              const maxButtons = 5;
              let startPage = Math.max(1, currentPage - 2);
              let endPage = startPage + maxButtons - 1;
              if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxButtons + 1);
              }
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }
              return pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded-md ${
                    page === currentPage ? "bg-blue-600 text-white cursor-default" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Página ${page}`}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Página siguiente"
            >
              Siguiente
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Última página"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </section>
      </section>
    </div>
  );
}
