import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import graphqlClient from "../../graphClient";

// ... (getCveProbabilities y sus tipos se mantienen como en la versión anterior) ...
// Tipo para la respuesta de getCveProbabilities
// const getCveProbabilities = async (agentId: string, policyId: string) => { ... }

const getAgentes = async () => {
  const data = await graphqlClient.request<{
    agentesWazuhTest: {
      id: string;
      name: string;
      ip: string;
      status: string;
      passedPolicies: number;
      failedPolicies: number;
      naPolicies: number;
      lastScan: string | null;
      policyName: string | null;
    }[];
  }>(GET_AGENTES_WAZUH);
  return data.agentesWazuhTest;
};

const getChecksFallados = async (
  paramAgenteId: string,
  paramPolicyId: string
) => {
  // Cambié nombres de params para claridad
  try {
    const data = await graphqlClient.request<{
      failedCheckIdsTest: number[];
    }>(GET_FAILED_CHECKS_QUERY, {
      // La query GraphQL espera 'agentId' y 'policyId'
      agentId: paramAgenteId, // <--- CORRECCIÓN AQUÍ
      policyId: paramPolicyId, // <--- CORRECCIÓN AQUÍ (aunque policyId ya coincidía)
    });
    return data.failedCheckIdsTest;
  } catch (error) {
    console.error(
      `Error fetching failed checks for agent ${paramAgenteId} and policy ${paramPolicyId}:`,
      error
    );
    return undefined;
  }
};

const getCveProbabilities = async (
  paramAgentId: string,
  paramPolicyId: string
) => {
  try {
    const data = await graphqlClient.request<{
      cveProbabilitiesForPolicyTest: {
        cveId: string;
        probability: number;
      }[];
    }>(GET_CVE_PROBS_QUERY, {
      agentId: paramAgentId, // <--- Asegurar consistencia aquí también
      policyId: paramPolicyId,
    });
    return data.cveProbabilitiesForPolicyTest;
  } catch (error) {
    console.error(
      `Error fetching CVE probabilities for agent ${paramAgentId} and policy ${paramPolicyId}:`,
      error
    );
    return undefined;
  }
};

// :::::::::::::::::::::::::::::::: DEFINICIONES GRAPHQL - Queries ::::::::::::::::::::::::::::::::

const GET_AGENTES_WAZUH = gql`
  query GetAgentesWazuhTest {
    agentesWazuhTest {
      id
      name
      ip
      status
      passedPolicies
      failedPolicies
      naPolicies
      lastScan
      policyName
    }
  }
`;

// La query espera $agentId y $policyId
const GET_FAILED_CHECKS_QUERY = gql`
  query GetFailedTestChecks($agentId: String!, $policyId: String!) {
    failedCheckIdsTest(agentId: $agentId, policyId: $policyId)
  }
`;

const GET_CVE_PROBS_QUERY = gql`
  query GetCveProbsForPolicy($agentId: String!, $policyId: String!) {
    cveProbabilitiesForPolicyTest(agentId: $agentId, policyId: $policyId) {
      cveId
      probability
    }
  }
`;

export const useWazuh = (agentIdParam?: string, policyIdParam?: string) => {
  const getAgentesQuery = useQuery({
    queryKey: ["agentesWazuh"],
    queryFn: getAgentes,
    staleTime: 1000 * 60 * 60,
  });

  // Los parámetros del hook (agentIdParam, policyIdParam) se pasan a las funciones de fetch
  const getChecksFalladosQuery = useQuery<number[] | undefined, Error>({
    queryKey: ["checksFallados", agentIdParam, policyIdParam],
    queryFn: () => {
      if (!agentIdParam || !policyIdParam) return Promise.resolve(undefined);
      return getChecksFallados(agentIdParam, policyIdParam); // Se pasan los params del hook
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!agentIdParam && !!policyIdParam,
  });

  const getCveProbsQuery = useQuery<
    { cveId: string; probability: number }[] | undefined,
    Error
  >({
    queryKey: ["cveProbs", agentIdParam, policyIdParam],
    queryFn: () => {
      if (!agentIdParam || !policyIdParam) return Promise.resolve(undefined);
      return getCveProbabilities(agentIdParam, policyIdParam); // Se pasan los params del hook
    },
    staleTime: 1000 * 60 * 15,
    enabled: !!agentIdParam && !!policyIdParam,
  });

  return {
    getAgentesQuery,
    getChecksFalladosQuery,
    getCveProbsQuery,
  };
};
