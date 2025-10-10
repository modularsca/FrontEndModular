// import React from 'react';
import { Card, Title } from "@tremor/react";
import AgentesDonuts from "../Views/AgentesDonuts/AgentesDonuts";

const Dashboard = () => {
  return (
    <div className="dashboard-container vh-full bg-white p-3">
      <Title className=" text-3xl m-2">Dashboard</Title>
      <Card>
        <AgentesDonuts />
      </Card>
    </div>
  );
};

export default Dashboard;
