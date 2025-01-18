import { FC, ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';

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
      {/* Navbar */}
        <nav className="w-full navbar navbar-expand-lg navbar-dark bg-dark px-4">
        {/* Izquierda: Palabra */}
        <a className={`navbar-brand ${styles.brand}`} href="/">Google</a>

        {/* Derecha: Componentes */}
        <div className="navbar-collapse justify-content-end p-2">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} onClick={click}>Home</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} onClick={click}>About</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} onClick={click}>Services</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} onClick={click}>Contact</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} onClick={onLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Layout */}
      <div className='d-flex'>
        <div className=" min-w-4">
          {/* Sidebar */}
          <div className={`${styles.sidebar}`}>
              <p className={`"col-9 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold " `}>Sidebar</p>
              <div className="nav flex-column ">
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Overview</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Work Orders</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Assets</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Search</p>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`overflow-auto w-full h-full shadow ${styles.content}`}>
          {children}
        </div>
      </div>

      {/* Footbar */}
      <footer className="bg-dark text-center text-white py-3">
        © 2025 My Dashboard
      </footer>
    </div>
  );
};

export default Layout;
