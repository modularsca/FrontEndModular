import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../graphClient';

const GET_AGENTES_WAZUH = `
    query GetAgentesWazuh {
        agentesWazuh {
            id
            name
            ip
            status
        }
    }
`;

const AgentesWazuh = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['agentesWazuh'], // El nombre único de la consulta
        queryFn: async () => {
            return graphqlClient.request<{ agentesWazuh: { id: string; name: string; ip: string; status: string }[] }>(
                GET_AGENTES_WAZUH
            );
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
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgentesWazuh;

