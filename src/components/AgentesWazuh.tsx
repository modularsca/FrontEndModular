import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../graphClient';

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

const AgentesWazuh = () => {
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;

    return (
        <div>
            <h1>Agentes Wazuh</h1>
            <ul>
                {data?.agentesWazuh.map((agente) => (
                    <li key={agente.id}>
                        <strong>Nombre:</strong> {agente.name} <br />
                        <strong>IP:</strong> {agente.ip} <br />
                        <strong>Estado:</strong> {agente.status} <br />
                        <strong>Políticas Pasadas:</strong> {agente.passedPolicies} <br />
                        <strong>Políticas Fallidas:</strong> {agente.failedPolicies} <br />
                        <strong>Políticas N/A:</strong> {agente.naPolicies} <br />
                        <strong>Último Escaneo:</strong> {agente.lastScan || 'No disponible'} <br />
                        <strong>Nombre de la Política:</strong> {agente.policyName || 'No disponible'} <br />
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgentesWazuh;
