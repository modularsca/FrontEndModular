import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../graphClient';
import { TableExample } from './TablaAgentes';
import { DonutChartHero } from './DonutChartTodosA';
import { DonutChartAgente } from './DonutChartAgente';

const GET_AGENTES_WAZUH = `
    query GetAgentesWazuh {
        agentesWazuh {
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

const TableAgentes = () => {
    // const { data, isLoading, error } = useQuery({
    //     queryKey: ['agentesWazuh'], // El nombre único de la consulta
    //     queryFn: async () => {
    //         return graphqlClient.request<{
    //             agentesWazuh: {
    //                 id: string;
    //                 name: string;
    //                 ip: string;
    //                 status: string;
    //                 passedPolicies: number;
    //                 failedPolicies: number;
    //                 naPolicies: number;
    //                 lastScan: string | null;
    //                 policyName: string | null;
    //             }[];
    //         }>(GET_AGENTES_WAZUH);
    //     },
    // });

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;

    // const agentesData = data?.agentesWazuh.map(agente => ({
    //     id: agente.id,
    //     name: agente.name,
    //     ip: agente.ip,
    //     status: agente.status,
    //     passed: agente.passedPolicies,
    //     failed: agente.failedPolicies,
    //     na: agente.naPolicies,
    //     lastScan: agente.lastScan || 'N/A',
    // }));

    // const donutChartData = [
    //     { name: 'Politicas Fallidas', amount: data?.agentesWazuh.reduce((acc, agente) => acc + agente.failedPolicies, 0) || 0 },
    //     { name: 'Politicas Pasadas', amount: data?.agentesWazuh.reduce((acc, agente) => acc + agente.passedPolicies, 0) || 0 },
    //     { name: 'Politicas N/A', amount: data?.agentesWazuh.reduce((acc, agente) => acc + agente.naPolicies, 0) || 0 },
    // ];
    const agentesData = [
        {
          id: "1",
          name: "Agente Alpha",
          ip: "192.168.1.10",
          status: "connected",
          passed: 15,
          failed: 2,
          na: 3,
          lastScan: "2023-11-25 14:30:00",
        },
      ];
      

    return (
        <div>
            <TableExample data={agentesData || []} />
        </div>
    );
};

export default TableAgentes;
