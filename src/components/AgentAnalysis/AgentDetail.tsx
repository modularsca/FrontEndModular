import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import graphqlClient from "../../graphClient";
import { gql } from "graphql-request";
import { useWazuh } from "../../hooks/useWazuh/useWazuh";
import { AgenteWazuh } from "../types/wazuh";

type CveData = {
  cveId: string;
  probability: number;
  description: string;
  possibleRisks: string;
};

const GET_CVE_PROBS_QUERY = gql`
  query GetCveProbsForPolicy($agentId: String!, $policyId: String!) {
    cveProbabilitiesForPolicy(agentId: $agentId, policyId: $policyId) {
      cveId
      probability
      description
      possibleRisks
    }
  }
`;

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgenteWazuh | null>(null);
  const [cves, setCves] = useState<CveData[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAgentesQuery } = useWazuh();

  useEffect(() => {
    const fetchAgentDetail = async () => {
      try {
        const agente = getAgentesQuery?.data?.find((a) => a.id === id);

        if (!agente || !agente.policyId) {
          setLoading(false);
          return;
        }

        setAgent(agente);

        const cveData = await graphqlClient.request<{
          cveProbabilitiesForPolicy: CveData[];
        }>(GET_CVE_PROBS_QUERY, {
          agentId: agente.id,
          policyId: agente.policyId,
        });

        setCves(cveData.cveProbabilitiesForPolicy);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error al obtener detalle de agente:", error);
        setLoading(false);
      }
    };

    fetchAgentDetail();
  }, [id]);

  if (loading) return <div className="p-4">Cargando datos del agente...</div>;

  if (!agent) return <div className="p-4">Agente no encontrado.</div>;

  return (
    <div className="p-4">
      <Link to="/AgentAnalysis" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Volver al análisis
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{agent.name}</h1>
      <p className="text-sm text-gray-600 mb-4">
        IP: {agent.ip} · Estado: {agent.status} · Política: {agent.policyName}
      </p>

      <h2 className="text-lg font-semibold text-indigo-700 mb-2">Lista completa de CVEs</h2>

      <div className="space-y-3">
        {cves
          .sort((a, b) => b.probability - a.probability)
          .map((cve) => (
            <div key={cve.cveId} className="bg-white rounded-xl shadow p-4 border border-gray-200">
              <h3
                className={`font-semibold text-sm ${
                  cve.probability < 60 ? "text-green-600" : cve.probability < 85 ? "text-orange-500" : "text-red-600"
                }`}
              >
                {cve.cveId} – {cve.probability}%
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Descripción:</strong> {cve.description || "N/A"}
              </p>
              <p className="text-sm text-red-500 mt-1">
                <strong>Riesgos posibles:</strong> {cve.possibleRisks || "N/A"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AgentDetail;
