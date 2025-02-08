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

const AgentesDonuts = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['agentesWazuh'], // El nombre único de la consulta
        queryFn: async () => {
            return graphqlClient.request<{
                agentesWazuh: {
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

    const manualData = [
        { name: 'Politicas Fallidas', amount: 5 },
        { name: 'Politicas Pasadas', amount: 10 },
        { name: 'Politicas N/A', amount: 2 },
    ];

    return (
        <div>
            

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center ">
                {data?.agentesWazuh.map(agente => {
                    const donutChartDataSolo = [
                        { name: 'Politicas Fallidas', amount: agente.failedPolicies },
                        { name: 'Politicas Pasadas', amount: agente.passedPolicies },
                        { name: 'Politicas N/A', amount: agente.naPolicies },
                    ];
                    return (
                        <DonutChartAgente key={agente.id} data={donutChartDataSolo} agentName={agente.name} />
                        
                    );
                })}
            </div> */}
                <DonutChartAgente key={1} data={manualData} agentName={"test"} />
            {/* <DonutChartHero data={donutChartData}/> */}
        </div>
    );
};

export default AgentesDonuts;
