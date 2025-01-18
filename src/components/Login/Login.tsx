import React, { FC, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error: string | null; // Asegúrate de que la propiedad error esté definida aquí
}

const Login: FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
      <div className="wp p-4 shadow" style={{ width: '25rem' }}>
        <p className={`text-center mb-3 ${styles.logintext}`}>Login</p>
        {error && (
          <div className="d-flex justify-content-center align-items-center">
            <div className={`alert alert-danger w-90 ${styles.alerttext}`} role="alert">
              {error}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="user" className={`form-label ${styles.label}`}>Email</label>
            <input
              type="text"
              className="form-control"
              id="user"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className={`form-label ${styles.label}`}>Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
