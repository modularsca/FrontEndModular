// import React from 'react';
import { DonutChart, Card, Title } from '@tremor/react';
import { DonutChartAgente } from '../DonutChartAgente';
import AgentesDonuts from '../AgentesDonuts';
import TableAgentes from '../TableAgentes';


const Details = () => {
  const data = [
    { name: 'Category A', value: 55 },
    { name: 'Category B', value: 25 },
    { name: 'Category C', value: 20 },
  ];

  return (
    <div className="dashboard-container vh-full bg-white p-3">
      <Title>Detalles Agente: {"1"}</Title>
      <Card>
      </Card>
    </div>
  );
};

export default Details;
