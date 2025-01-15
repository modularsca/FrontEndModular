import React, { useState, FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

// const Login: FC = () => {
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log('Login submitted');
//   };

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const predefinedUser = {
    username: 'admin',
    password: '1234',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de usuario y contraseña
    if (username === predefinedUser.username && password === predefinedUser.password) {
      console.log('Login exitoso');
      navigate('/dashboard'); // Redirige al Dashboard
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
      <div className={`p-4 shadow ${styles.logindiv}`}>
        <p className={`text-center mb-3 ${styles.logintext}`}>Login</p>
        <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column align-items-center">
          {error && <div className={`alert alert-danger w-80  ${styles.alerttext}`} role="alert">{error}</div>}
        </div>
          <div className="mb-3">
            <label htmlFor="user" className={`form-label ${styles.label}`}>Email</label>
            <input type="text" className="form-control" id="user" placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className={`form-label ${styles.label}`}>Password</label>
            <input type="password" className="form-control" id="password"
             placeholder="Enter your password" 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
            />
          </div>
          {/* {error && <div className="text-danger mb-3">{error}</div>} */}
          <div className="d-flex flex-column align-items-center">
            <button type="submit" className="btn btn-primary w-80 mt-3">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
