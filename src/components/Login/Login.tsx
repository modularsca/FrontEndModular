import React, { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';

const Login: FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login submitted');
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
      <div className={`wp p-4 shadow ${styles.card}`} style={{ width: '25rem' }}>
      <h3 className="text-center mb-3" style={{ fontSize: '2.5vh' }}>Login</h3>
      <form onSubmit={handleSubmit}>
      {/* Email input */}
      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          placeholder="Enter your email"
        />
        <label htmlFor="form2Example1" className="form-label">
          Email address
        </label>
      </div>

      {/* Password input */}
      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          placeholder="Enter your password"
        />
        <label htmlFor="form2Example2" className="form-label">
          Password
        </label>
      </div>

      {/* 2 column grid layout for inline styling */}
      <div className="row mb-4">
        <div className="col d-flex justify-content-center">
          {/* Checkbox */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="form2Example31">
              Remember me
            </label>
          </div>
        </div>

        <div className="col text-end">
          {/* Simple link */}
          <a href="#!">Forgot password?</a>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="button"
        data-mdb-button-init
        data-mdb-ripple-init
        className="btn btn-primary btn-block mb-4"
      >
        Sign in
      </button>

      {/* Register buttons */}
      <div className="text-center">
        <p>
          Not a member? <a href="#!">Register</a>
        </p>
        <p>or sign up with:</p>
        <div>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-facebook-f"></i>
          </button>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-google"></i>
          </button>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-twitter"></i>
          </button>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-github"></i>
          </button>
        </div>
      </div>
    </form>
    </div>
    </div>

    // <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
    //   <div className="wp p-4 shadow" style={{ width: '25rem' }}>
    //     <h3 className="text-center mb-3" style={{ fontSize: '2.5vh' }}>Login</h3>
    //     <form onSubmit={handleSubmit}>
    //       <div className="mb-3">
    //         <label htmlFor="email" className={`form-label ${styles.label}`}>Email</label>
    //         <input 
    //           type="email" 
    //           className="form-control" 
    //           id="email" 
    //           placeholder="Enter your email"
    //           required 
    //         />
    //       </div>
    //       <div className="mb-3">
    //         <label htmlFor="password" className={`form-label ${styles.label}`}>Password</label>
    //         <input 
    //           type="password" 
    //           className="form-control" 
    //           id="password" 
    //           placeholder="Enter your password"
    //           required 
    //         />
    //       </div>
    //       <button type="submit" className="btn btn-primary w-100">Login</button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default Login;
