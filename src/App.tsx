import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Details from './components/Dashboard/Details';
import DashboardAgentes from './components/Dashboard/DashboardAgentes';
import Management from './components/Management/Management';
import Tools from './components/Tools/Tools';
import Agents from './components/Agents/Agents';
import Settings from './components/Settings/Settings';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (username: string, password: string) => {
    const defaultUsername = 'admin';
    const defaultPassword = '123';

    if (username === defaultUsername && password === defaultPassword) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className=' h-full shadow-slate-500 w-full min-w-min' >
        <Layout onLogout={handleLogout}>
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/management" element={<Management />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/DashboardAgentes" element={<DashboardAgentes />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </Layout>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} error={error} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
