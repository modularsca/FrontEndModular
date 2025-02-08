import { FC, ReactNode, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface LayoutProps {
  children: ReactNode; // El contenido que se renderizará dentro del layout
  onLogout: () => void;
}

const click = () => {
  alert("boton");
};

const Layout: FC<LayoutProps> = ({ children, onLogout }) => {
  
  return (
    <div className={` ${styles.layout}`}>
      
       <nav className="w-full navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className={`navbar-brand ${styles.brand}`} href="/">Google</a>
        <div className="navbar-collapse justify-content-end p-2">
          <ul className="navbar-nav">
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={click}>Home</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={click}>About</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={click}>Services</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={click}>Contact</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={onLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav> 

      <div className="d-flex h-full">
        {/* <div className="flex-shrink-0 bg-dark text-white h-screen" style={{ width: '250px' }}> */}
        <div className={`flex-shrink-0 bg-dark text-white h-screen col-lg-4 col-sm-2 ${styles.sidebar}`} style={{ width: '250px' }}>
          <p className="fs-2 p-3">Options</p>
          <div className="nav flex-column">
            <Link to="/dashboard" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Overview
            </Link>
            <Link to="/agents" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Agents
            </Link>
            <Link to="/management" className={`w-75 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Management
            </Link>
            <Link to="/tools" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Tools
            </Link>
            <Link to="/settings" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Settings
            </Link>
          </div>

          
        </div>
      

        <div className={`mb-5 ${styles.content}`}>
          <div className="col-lg-11 col-md-10 col-sm-8 m-3 p-2 bg-light border border-rounded" style={{ borderRadius: '15px' }}>
            {/* hola */}
            {children}
          </div>
          {/* {children} */}
        </div>

        {/* <div className={`overflow-auto w-full h-full shadow ${styles.content}`}>
          {children}
        </div> */}
      </div>

      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" defer></script>

    </div>

    
  );
};


export default Layout;
