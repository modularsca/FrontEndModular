import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../graphClient';

const GET_AGENTES = `
    query GetAgentes {
        agentes {
            name
            os
        }
    }
`;

const Agentes = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['agentes'], // El nombre único de la consulta
        queryFn: async () => {
            return graphqlClient.request<{ agentes: { name: string; os: string }[] }>(GET_AGENTES);
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;

    return (
        <div>
            <h1>Agentes</h1>
            <ul>
                {data?.agentes.map((agente, index) => (
                    <li key={index}>
                        {agente.name} - {agente.os}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Agentes;
