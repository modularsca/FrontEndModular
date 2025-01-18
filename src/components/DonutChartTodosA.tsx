"use client"

import { AnyUseMutationOptions } from "@tanstack/react-query";
import { DonutChart } from "../components/DonutChart"

interface DonutChartHeroProps {
    data: Array<{
        name: string;
        amount: number;
      }>;
}


export const DonutChartHero = ({data}:DonutChartHeroProps) => (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-gray-700 dark:text-gray-300 mt-4 text-blue-700 font-bold border-b-2 border-gray-800 ">Resultados de todos los Agentes</p>
      <DonutChart
        data={data}
        category="name"
        value="amount"
      />
    </div>
)