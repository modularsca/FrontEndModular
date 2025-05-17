import { FC, ReactNode, useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

interface Notification {
  id: string;
  title: string;
  subtitle: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
}

const Layout: FC<LayoutProps> = ({ children, onLogout }) => {
  const [count, setCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);

  // Conexión WebSocket
  useEffect(() => {
    ws.current = new WebSocket('ws://tu-servidor-websocket');
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotification: Notification = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        title: data.title || 'Nueva notificación',
        subtitle: data.subtitle || 'Mensaje recibido del servidor',
        type: data.type || 'info',
        timestamp: new Date(data.timestamp || Date.now())
      };
      
      addNotification(newNotification);
      setCount(prev => prev + 1);
    };
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Función para añadir notificaciones
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Manejar clic en el botón de Notifications
  const handleNotificationClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Notificación ${newCount}`,
      subtitle: 'Esta es una notificación de prueba',
      type: 'error', // Para el borde rojo
      timestamp: new Date()
    };
    
    addNotification(newNotification);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Función para obtener el color del borde izquierdo según el tipo
  const getBorderColor = (type: Notification['type']): string => {
    const colors = {
      info: '#0dcaf0',    // Azul claro
      warning: '#ffc107', // Amarillo
      error: '#dc3545',   // Rojo
      success: '#198754'  // Verde
    };
    return colors[type] || colors.info;
  };

  return (
    <div className={`${styles.layout}`}>
      {/* Contenedor de notificaciones - posición inferior derecha */}
      <div className="position-fixed bottom-20 end-10" style={{ zIndex: 1100 }}>
        {notifications.map(notification => (
          <div 
            key={notification.id}
            style={{
              width: '400px',
              minHeight: '150px', // Más flexible que altura fija
              backgroundColor: '#333',
              color: 'white',
              marginBottom: '15px',
              position: 'relative',
              borderLeft: `5px solid ${getBorderColor(notification.type)}`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '4px'
            }}
          >
            {/* Botón de cerrar */}
            <button 
              onClick={() => removeNotification(notification.id)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                opacity: '0.7',
                transition: 'opacity 0.2s',
                lineHeight: '1'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              &times;
            </button>
            
            {/* Contenido de la notificación */}
            <div>
              <h3 style={{ 
                marginBottom: '5px', 
                fontWeight: 'bold',
                fontSize: '1.4rem',
                color: 'white',
              }}>
                {notification.title}
              </h3>
              <p style={{ 
                marginBottom: '10px', 
                color: '#ddd',
                fontSize: '1.2rem',
                fontWeight: 'lighter'
              }}>
                {notification.subtitle}
              </p>
            </div>
            
            {/* Hora */}
            <div style={{ 
              color: '#ddd',
              fontSize: '1.4rem',
              textAlign: 'left',
              marginTop: '10px',
            }}>
              {notification.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
              }).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      
      <nav className="w-full navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className={`navbar-brand ${styles.brand}`} href="/">Proyecto M</a>
        <div className="navbar-collapse justify-content-end p-2">
          <ul className="navbar-nav">
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`}>Home</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`}>About</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`}>Services</a>
            </li>
            <li className="nav-item w-25 position-relative">
              <a 
                className={`nav-link p-2 w-50 ${styles.nav_link}`} 
                onClick={handleNotificationClick}
                style={{ cursor: 'pointer' }}
              >
                Notifications
                {count > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {count}
                  </span>
                )}
              </a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 w-50 ${styles.nav_link}`} onClick={onLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="d-flex h-full">
        <div className={`flex-shrink-0 bg-dark text-white h-screen col-lg-4 col-sm-2 ${styles.sidebar}`} style={{ width: '250px' }}>
          <div className="nav flex-column">
            <Link to="/dashboard" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Dashboard
            </Link>
            <Link to="/agents" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Actividad
            </Link>
            <Link to="/management" className={`w-75 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Estadisticas
            </Link>
            <Link to="/tools" className={`w-50 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Analisis
            </Link>
            <Link to="/settings" className={`w-75 nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Configuración
            </Link>
          </div>
        </div>
      
        <div className={`mb-5 ${styles.content}`}>
          <div className="col-lg-11 col-md-10 col-sm-8 m-3 p-2 bg-light border border-rounded" style={{ borderRadius: '15px' }}>
            {children}
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" defer></script>
    </div>
  );
};

export default Layout;