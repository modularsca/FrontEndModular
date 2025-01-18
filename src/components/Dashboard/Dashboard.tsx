// import React from 'react';
import { DonutChart, Card, Title } from '@tremor/react';
import { DonutChartAgente } from '../DonutChartAgente';
import AgentesWazuh from '../AgentesWazuh';


const Dashboard = () => {
  const data = [
    { name: 'Category A', value: 55 },
    { name: 'Category B', value: 25 },
    { name: 'Category C', value: 20 },
  ];

  return (
    <div className="dashboard-container vh-full bg-white p-3">
      <Title>Dashboard</Title>
      <Card>
        <AgentesWazuh/>
      </Card>
    </div>
  );
};

export default Dashboard;
