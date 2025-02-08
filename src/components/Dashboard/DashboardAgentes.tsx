// import React from 'react';
import { DonutChart, Card, Title } from '@tremor/react';
import { DonutChartAgente } from '../DonutChartAgente';
import AgentesDonuts from '../AgentesDonuts';
import TableAgentes from '../TableAgentes';


const DashboardAgentes = () => {
  const data = [
    { name: 'Category A', value: 55 },
    { name: 'Category B', value: 25 },
    { name: 'Category C', value: 20 },
  ];

  return (
    <div className="dashboard-container vh-full bg-white p-3">
      <Title>Dashboard 2</Title>
      <Card>
        <TableAgentes/>
      </Card>
    </div>
  );
};

export default DashboardAgentes;
