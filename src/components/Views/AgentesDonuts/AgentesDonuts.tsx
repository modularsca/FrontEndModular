import { useWazuh } from "../../../hooks/useWazuh/useWazuh";
import { DonutChartAgente } from "../../General/DonutChartAgente";
const AgentesDonuts = () => {
  const { getAgentesQuery } = useWazuh();

  if (getAgentesQuery.isLoading) return <p>Loading...</p>;
  if (getAgentesQuery.error)
    return (
      <p>
        Error:{" "}
        {getAgentesQuery.error instanceof Error
          ? getAgentesQuery.error.message
          : "Unknown error"}
      </p>
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center ">
        {getAgentesQuery.data?.map((agente) => {
          const donutChartDataSolo = [
            { name: "Politicas Fallidas", amount: agente.failedPolicies },
            { name: "Politicas Pasadas", amount: agente.passedPolicies },
            { name: "Politicas N/A", amount: agente.naPolicies },
          ];
          return (
            <DonutChartAgente
              key={agente.id}
              data={donutChartDataSolo}
              agentName={agente.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AgentesDonuts;
