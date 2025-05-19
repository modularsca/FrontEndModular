import { useWazuh } from "../../../hooks/useWazuh/useWazuh";
import { TableExample } from "../../General/TableExample";

const TableAgentes = () => {
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

  const agentesData = getAgentesQuery.data?.map((agente) => ({
    id: agente.id,
    name: agente.name,
    ip: agente.ip,
    status: agente.status,
    passed: agente.passedPolicies,
    failed: agente.failedPolicies,
    na: agente.naPolicies,
    lastScan: agente.lastScan || "N/A",
  }));

  return (
    <div>
      <TableExample data={agentesData || []} />
    </div>
  );
};

export default TableAgentes;
