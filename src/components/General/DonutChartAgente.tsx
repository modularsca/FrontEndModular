"use client";

import { useNavigate } from "react-router-dom";
import { DonutChart } from "./DonutChart";

interface DonutChartHeroProps {
  key: string;
  data: Array<{
    name: string;
    amount: number;
  }>;
  agentId?: string;
  agentName: string;
}

export const DonutChartAgente = ({ data, agentId, agentName }: DonutChartHeroProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 border-sky-500 shadow-md p-4 rounded-md border-2 m-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => navigate(`/details/${agentId}`)}
    >
      <p className="text-gray-700 dark:text-gray-300 mt-4 font-bold border-b-2 border-gray-800">Agente {agentName}</p>
      <DonutChart data={data} category="name" value="amount" />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        // onClick={() => navigate(`/details/${agentName}`)}
        onClick={() => navigate(`/details/${agentId}`)}
      >
        Ver Más{" "}
      </button>
    </div>
  );
};
