// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Details from "./components/Dashboard/Details";
import Tools from "./components/Tools/Tools";
import Agents from "./components/Agents/Agents";
import Settings from "./components/Settings/Settings";
import Estadisticas from "./components/Estadisticas/Estadisticas";
import AgentAnalysis from "./components/AgentAnalysis/AgentAnalysis";
import AgentDetail from "./components/AgentAnalysis/AgentDetail";
import { useAuth } from "./context/AuthContext"; // <-- 1. IMPORTAR HOOK

const App: React.FC = () => {
  // 2. OBTENER ESTADO Y FUNCIONES DEL CONTEXTO
  const { isAuthenticated, logout: handleLogout } = useAuth();

  // El 'handleLogin' y el 'error' local se eliminan.
  // El componente Login los obtendrá del contexto también.

  return (
    <Router>
      {isAuthenticated ? ( // 3. USAR ESTADO DEL CONTEXTO
        <div className=" h-full shadow-slate-500 w-full min-w-min">
          <Layout onLogout={handleLogout}>
            {" "}
            {/* 4. USAR LOGOUT DEL CONTEXTO */}
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agents" element={<Agents />} />
              <Route path="estadisticas" element={<Estadisticas />} />
              <Route path="tools" element={<Tools />} />
              <Route path="settings" element={<Settings />} />
              <Route path="details/:id" element={<Details />} />
              <Route path="agentAnalysis" element={<AgentAnalysis />} />
              <Route path="agentAnalysis/:id" element={<AgentDetail />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </div>
      ) : (
        <Routes>
          {/* 5. EL LOGIN YA NO NECESITA PROPS */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
