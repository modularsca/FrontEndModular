"use client"

import { AnyUseMutationOptions } from "@tanstack/react-query";
import { DonutChart } from "./DonutChart"

interface DonutChartHeroProps {
    data: Array<{
        name: string;
        amount: number;
      }>;
    agentName: string;
}


export const DonutChartAgente = ({data, agentName}:DonutChartHeroProps) => (
        <div className="flex flex-col items-center justify-center gap-4 border-sky-500 bshadow-md p-4 rounded-md border-2 m-5 ">
        <p className=" text-gray-700 dark:text-gray-300 mt-4 text-blue-700 font-bold border-b-2 border-gray-800 ">Agente {agentName}</p>
      <DonutChart
        data={data}
        category="name"
        value="amount"
      />
    </div>
)