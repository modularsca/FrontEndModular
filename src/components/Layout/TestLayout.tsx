import { FC, ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';
import { Link } from 'react-router-dom';
import Assets from '../Management/Management';

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

      <div className="d-flex">
        {/* Sidebar */}
        {/* <div className={`w-90 ${styles.sidebar}`}>
            <p className={`col-9 ${styles.side_title}`}>Sidebar111</p>
            <div className="nav flex-column">
                <p className={`col-10 ${styles.side_options}`}>Overview</p>
                <p className={`col-10 ${styles.side_options}`}>Work Orders</p>
                <p className={`col-10 ${styles.side_options}`}>Assets</p>
                <p className={`col-10 ${styles.side_options}`}>Search</p>
            </div>
        </div> */}

        {/* Sidebar */}
        <div className='d-flex'>
          {/* <div className=" min-w-4">
            <div className={`${styles.sidebar}`}>
              <p className={`"col-9 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold " `}>ASidebar</p>
              <div className="nav flex-column ">
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Overview</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Work Orders</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Assets</p>
                  <p className="col-9 text-lg sm:text-xl md:text-2xl lg:text-xl mt-2">Search</p>
              </div>
            </div>
          </div> */}
          <div className={`w-25 ${styles.sidebar}`}>
            <p className={`col-9 ${styles.side_title}`}>Sidebar111</p>
            <div className="nav flex-column">
              <Link to="/dashboard" className={`col-10 ${styles.side_options}`}>
                Overview
              </Link>
              <Link to="/assets" className={`col-10 ${styles.side_options}`}>
                Assets
              </Link>

              {/* <Link to="/work-orders" className={`col-10 ${styles.side_options}`}>
                Work Orders
              </Link>
              <Link to="/search" className={`col-10 ${styles.side_options}`}>
                Search
              </Link> */}
            </div>
          </div>

          {/* Main Content */}
          <div className={`overflow-auto w-full h-full shadow ${styles.content}`}>
            {children}
          </div>
        </div>

          {/* Footbar */}
          {/* <footer className="bg-dark text-center text-white py-3">
            © 2025 My Dashboard
          </footer> */}
        </div>
    </div>
  );
};


export default Layout;
