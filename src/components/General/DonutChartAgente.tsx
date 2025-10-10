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
  console.log("data en chart");
  console.log(data);
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 border-sky-500 shadow-md p-4 rounded-md border-2 m-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => navigate(`/details/${agentId}`)}
    >
      <p className="text-gray-700 dark:text-gray-300 font-bold border-b-2 border-gray-800">Agente {agentName}</p>

      <DonutChart data={data} category="name" value="amount" />

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Checks</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            Fallidos <span className="font-bold text-red-600">{data[0].amount}</span>
          </p>
          <p className="text-sm">
            Pasados <span className="font-bold text-green-600">{data[1].amount}</span>
          </p>
          <p className="text-sm">
            N/A <span className="font-bold text-gray-800 dark:text-gray-200">{data[2].amount}</span>
          </p>
        </div>
      </div>

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => navigate(`/details/${agentId}`)}
      >
        Ver Más
      </button>
    </div>
  );
};
