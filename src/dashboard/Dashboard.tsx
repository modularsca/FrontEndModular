// import React from 'react';
import { DonutChart, Card, Title } from '@tremor/react';

const Dashboard = () => {
  const data = [
    { name: 'Category A', value: 55 },
    { name: 'Category B', value: 25 },
    { name: 'Category C', value: 20 },
  ];

  return (
    <div className="dashboard-container">
      <Title>Dashboard</Title>
      <Card>
        <DonutChart
          data={data}
          category="value"
          index="name" // Cambiado de dataKey a index
          colors={['blue', 'green', 'red']}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
