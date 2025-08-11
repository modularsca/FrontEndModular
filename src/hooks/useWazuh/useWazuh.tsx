import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import graphqlClient from "../../graphClient";

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

const getChecksFallados = async (paramAgenteId: string, paramPolicyId: string) => {
  try {
    const data = await graphqlClient.request<{
      failedCheckIdsTest: number[];
    }>(GET_FAILED_CHECKS_QUERY, {
      agentId: paramAgenteId,
      policyId: paramPolicyId,
    });
    return data.failedCheckIdsTest;
  } catch (error) {
    console.error(`Error fetching failed checks for agent ${paramAgenteId} and policy ${paramPolicyId}:`, error);
    return undefined;
  }
};

const getCveProbabilities = async (paramAgentId: string, paramPolicyId: string) => {
  try {
    const data = await graphqlClient.request<{
      cveProbabilitiesForPolicyTest: {
        cveId: string;
        probability: number;
      }[];
    }>(GET_CVE_PROBS_QUERY, {
      agentId: paramAgentId,
      policyId: paramPolicyId,
    });
    return data.cveProbabilitiesForPolicyTest;
  } catch (error) {
    console.error(`Error fetching CVE probabilities for agent ${paramAgentId} and policy ${paramPolicyId}:`, error);
    return undefined;
  }
};

const getHistoricalFailedChecksSummaryGeneral = async () => {
  try {
    const data = await graphqlClient.request<{
      generalLatestFailedChecksSummary: {
        formattedData: string;
        id: string;
        totalFailedCount: number;
      }[];
    }>(GET_HISTORICAL_FAILED_CHECKS_SUMARY);
    return data.generalLatestFailedChecksSummary;
  } catch (error) {
    console.error("Error fetching general historical failed checks summary:", error);
    throw error;
  }
};

// 2. Obtener el resumen histórico de fallos POR AGENTE (recibe un agentId)
const getHistoricalFailedChecksSummaryByAgent = async (paramAgentId: string) => {
  try {
    const data = await graphqlClient.request<{
      historicalFailedChecksByAgent: {
        failedChecksCount: number;
        id: string;
        formattedData: string;
      }[];
    }>(GET_HISTORICAL_FAILED_CHECKS_SUMARY_BY_AGENT, {
      agentId: paramAgentId,
    });
    return data.historicalFailedChecksByAgent;
  } catch (error) {
    console.error(`Error fetching historical failed checks for agent ${paramAgentId}:`, error);
    throw error;
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

export const GET_POLICY_CHECKS_TEST = gql`
  query GetPolicyChecksTest($agentId: String!) {
    policyChecksTest(agentId: $agentId) {
      id
      result
      title
      policyId
      description
      remediation
    }
  }
`;

const GET_FAILED_CHECKS_QUERY = gql`
  query GetFailedTestChecks($agentId: String!, $policyId: String!) {
    failedCheckIdsTest(agentId: $agentId, policyId: $policyId)
  }
`;

const GET_HISTORICAL_FAILED_CHECKS_SUMARY = gql`
  query MyQuery {
    generalLatestFailedChecksSummary(limit: 10) {
      formattedData
      id
      totalFailedCount
    }
  }
`;

const GET_HISTORICAL_FAILED_CHECKS_SUMARY_BY_AGENT = gql`
  query MyQuery2($agentId: String!) {
    historicalFailedChecksByAgent(agentId: $agentId, limit: 10) {
      failedChecksCount
      id
      formattedData
    }
  }
`;

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

  const getCveProbsQuery = useQuery<{ cveId: string; probability: number }[] | undefined, Error>({
    queryKey: ["cveProbs", agentIdParam, policyIdParam],
    queryFn: () => {
      if (!agentIdParam || !policyIdParam) return Promise.resolve(undefined);
      return getCveProbabilities(agentIdParam, policyIdParam); // Se pasan los params del hook
    },
    staleTime: 1000 * 60 * 15,
    enabled: !!agentIdParam && !!policyIdParam,
  });

  const getHistoricalFailedChecksSummaryGeneralQuery = useQuery({
    queryKey: ["historicalFailedChecksSummaryGeneral"],
    queryFn: getHistoricalFailedChecksSummaryGeneral,
    staleTime: 1000 * 60 * 60,
  });

  const getHistoricalFailedChecksSummaryByAgentQuery = useQuery({
    queryKey: ["historicalFailedChecksSummaryByAgent", agentIdParam],
    queryFn: () => {
      if (!agentIdParam) {
        return Promise.resolve(undefined);
      }
      return getHistoricalFailedChecksSummaryByAgent(agentIdParam);
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!agentIdParam,
  });

  const getPolicyChecksTest = (agentId: string) =>
    useQuery({
      queryKey: ["policyChecksTest", agentId],
      queryFn: async () => {
        const res = await graphqlClient.request<{ policyChecksTest: any }>(GET_POLICY_CHECKS_TEST, {
          agentId,
        });
        return res.policyChecksTest;
      },
      enabled: !!agentId, // solo corre si hay agentId
    });

  return {
    getAgentesQuery,
    getChecksFalladosQuery,
    getCveProbsQuery,
    getHistoricalFailedChecksSummaryByAgentQuery,
    getHistoricalFailedChecksSummaryGeneralQuery,
    getPolicyChecksTest,
  };
};
