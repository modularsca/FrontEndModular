// import React from 'react';
import { Card, Title } from "@tremor/react";
import AgentesDonuts from "../Views/AgentesDonuts/AgentesDonuts";
import { useState } from "react";

const Dashboard = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="dashboard-container vh-full bg-white p-3">
      <Title className=" text-3xl m-2">Dashboard</Title>
      <input
        type="text"
        placeholder="Filtrar agentes..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />
      <Card>
        <AgentesDonuts />
      </Card>
    </div>
  );
};

export default Dashboard;
