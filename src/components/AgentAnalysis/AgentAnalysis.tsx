import React, { useEffect, useState } from "react";
import { useWazuh } from "../../hooks/useWazuh/useWazuh";
import graphqlClient from "../../graphClient";
import { gql } from "graphql-request";
import { Link } from "react-router-dom";

// Tipos de CVEs esperados
type CveData = {
  cveId: string;
  probability: number;
  description: string;
  possibleRisks: string;
};

// Estructura por agente con top CVEs
type CveAgentData = {
  id: string;
  name: string;
  topCVEs: CveData[];
};

const GET_CVE_PROBS_QUERY = gql`
  query GetCveProbsForPolicy($agentId: String!, $policyId: String!) {
    cveProbabilitiesForPolicyTest(agentId: $agentId, policyId: $policyId) {
      cveId
      probability
      description
      possibleRisks
    }
  }
`;

const getCveProbabilities = async (
  agentId: string,
  policyId: string
): Promise<CveData[] | undefined> => {
  try {
    const data = await graphqlClient.request<{
      cveProbabilitiesForPolicyTest: CveData[];
    }>(GET_CVE_PROBS_QUERY, {
      agentId,
      policyId,
    });

    return data.cveProbabilitiesForPolicyTest;
  } catch (error) {
    console.error(
      `❌ Error al obtener CVEs para el agente ${agentId}:`,
      error
    );
    return undefined;
  }
};

const AgentAnalysis: React.FC = () => {
  const { getAgentesQuery } = useWazuh();
  const [cveDataList, setCveDataList] = useState<CveAgentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isSuccess, data: agentes } = getAgentesQuery;

  useEffect(() => {
    const fetchCvesPorAgente = async () => {
      if (isSuccess && agentes) {
        const resultados: CveAgentData[] = [];

        for (const agente of agentes) {
          if (!agente.id || !agente.policyName) continue;

          const cveList = await getCveProbabilities(
            agente.id,
            agente.policyName
          );

          if (cveList && cveList.length > 0) {
            const topCVEs = [...cveList]
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 3);

            resultados.push({
              id: agente.id,
              name: agente.name,
              topCVEs,
            });
          }
        }

        setCveDataList(resultados);
        setLoading(false);
      }
    };

    fetchCvesPorAgente();
  }, [isSuccess, agentes]);

  if (loading) return <div>Cargando análisis de agentes...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cveDataList.map((agente) => (
        <div
          key={agente.id}
          className="bg-white shadow-md rounded-2xl p-4 border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">
            {agente.name}
          </h2>

          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            Top 3 CVEs más riesgosos:
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
            {agente.topCVEs.map((cve) => (
              <li key={cve.cveId}>
                <strong>{cve.cveId}</strong> – {cve.probability}%
                <p className="text-xs text-gray-500 pl-4">{cve.description}</p>
              </li>
            ))}
          </ul>

          <Link
            to={`/agentAnalysis/${agente.id}`}
            className="text-blue-600 text-sm hover:underline"
          >
            Ver detalles →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AgentAnalysis;
