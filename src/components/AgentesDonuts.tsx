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

const AgentesDonuts = () => {
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
    
    return (
        <div>
            {/* <TableExample data={agentesData || []} /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center ">
                {data?.agentesWazuhTest.map(agente => {
                    const donutChartDataSolo = [
                        { name: 'Politicas Fallidas', amount: agente.failedPolicies },
                        { name: 'Politicas Pasadas', amount: agente.passedPolicies },
                        { name: 'Politicas N/A', amount: agente.naPolicies },
                    ];
                    return (
                        <DonutChartAgente key={agente.id} data={donutChartDataSolo} agentName={agente.name} />
                        
                    );
                })}
            </div>
        </div>
    );
};

export default AgentesDonuts;
