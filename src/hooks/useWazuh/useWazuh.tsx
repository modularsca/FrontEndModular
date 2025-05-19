import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import graphqlClient from "../../graphClient";

// :::::::::::::::::::::::::::::::: Request - Queries ::::::::::::::::::::::::::::::::

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

// :::::::::::::::::::::::::::::::: DEFINICIONES GRAPHQL - Queries ::::::::::::::::::::::::::::::::

// TODO: cambiar test por prod cuando se pase a produccion
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

// :::::::::::::::::::::::::::::::: EXPORTS ::::::::::::::::::::::::::::::::

export const useWazuh = () => {
  // :::::::::::::::::::::::::::::::: Definicion Constantes - Queries ::::::::::::::::::::::::::::::::

  const getAgentesQuery = useQuery({
    queryKey: ["agentesWazuh"],
    queryFn: getAgentes,
    refetchInterval: 10000,
    staleTime: 1000 * 60 * 60,
  });

  return {
    getAgentesQuery,
  };
};
