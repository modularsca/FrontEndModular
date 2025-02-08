import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../graphClient';
import { TableExample } from './TablaAgentes';
import { DonutChartHero } from './DonutChartTodosA';
import { DonutChartAgente } from './DonutChartAgente';

//TODO: quitar test en producción

const GET_AGENTES_WAZUH = `
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

const TableAgentes = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['agentesWazuh'], // El nombre único de la consulta
        queryFn: async () => {
            return graphqlClient.request<{
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
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;

    const agentesData = data?.agentesWazuhTest.map(agente => ({
        id: agente.id,
        name: agente.name,
        ip: agente.ip,
        status: agente.status,
        passed: agente.passedPolicies,
        failed: agente.failedPolicies,
        na: agente.naPolicies,
        lastScan: agente.lastScan || 'N/A',
    }));

    const donutChartData = [
        { name: 'Politicas Fallidas', amount: data?.agentesWazuhTest.reduce((acc, agente) => acc + agente.failedPolicies, 0) || 0 },
        { name: 'Politicas Pasadas', amount: data?.agentesWazuhTest.reduce((acc, agente) => acc + agente.passedPolicies, 0) || 0 },
        { name: 'Politicas N/A', amount: data?.agentesWazuhTest.reduce((acc, agente) => acc + agente.naPolicies, 0) || 0 },
    ];

      

    return (
        <div>
            <TableExample data={agentesData || []} />
        </div>
    );
};

export default TableAgentes;
