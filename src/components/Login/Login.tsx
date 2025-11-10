// src/components/Login/Login.tsx
import React, { FC, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext"; // <-- 1. IMPORTAR

// 2. EL COMPONENTE YA NO RECIBE PROPS
const Login: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 3. OBTENER TODO DEL CONTEXTO
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password); // 4. LLAMAR A LA FUNCIÓN DEL CONTEXTO
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
      <div className="wp p-4 shadow" style={{ width: "25rem" }}>
        <p className={`text-center mb-3 ${styles.logintext}`}>Login</p>

        {/* 5. MOSTRAR ERROR DEL CONTEXTO */}
        {error && (
          <div className="d-flex justify-content-center align-items-center">
            <div className={`alert alert-danger w-90 ${styles.alerttext}`} role="alert">
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="user" className={`form-label ${styles.label}`}>
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="user"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading} // 6. Deshabilitar si está cargando
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className={`form-label ${styles.label}`}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // 6. Deshabilitar si está cargando
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
            {isLoading ? "Iniciando..." : "Login"} {/* 7. Mostrar estado de carga */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
