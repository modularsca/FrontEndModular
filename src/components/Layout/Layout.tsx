import { FC, ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode; // El contenido que se renderizará dentro del layout
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        {/* Izquierda: Palabra */}
        <a className={`navbar-brand ${styles.brand}`} href="/">Google</a>

        {/* Derecha: Componentes */}
        <div className="navbar-collapse justify-content-end p-2">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} href="/services">Services</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} href="/contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.nav_link}`} href="/login">Login</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="d-flex">
        {/* Sidebar */}
        <div className={`${styles.sidebar}`}>
            <p className={`col-9 ${styles.side_title}`}>Sidebar</p>
            <div className="nav flex-column">
                <p className={`col-10 ${styles.side_options}`}>Overview</p>
                <p className={`col-10 ${styles.side_options}`}>Work Orders</p>
                <p className={`col-10 ${styles.side_options}`}>Assets</p>
                <p className={`col-10 ${styles.side_options}`}>Search</p>
            </div>
        </div>


        {/* Main Content */}
        <div className={`flex-grow-1 shadow ${styles.content}`}>
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
