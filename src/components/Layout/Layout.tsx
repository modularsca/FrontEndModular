import { FC, ReactNode } from "react"; // Eliminado useState ya que no habrá estado local de notificaciones
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Layout.module.css"; //
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Importa el hook y el tipo de mensaje del NotificacionContext
// Ajusta la ruta si es diferente
import { useNotification, NotificationMessage } from "../../context/NotificacionContext"; //

import PollingOrchestrator from "../PollingOrchestrator/PollingOrchestrator";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

// Ya no necesitamos la interfaz local Notification

const Layout: FC<LayoutProps> = ({ children, onLogout }) => {
  // Consumimos las notificaciones y la función para removerlas del NotificacionContext
  const { notifications, removeNotification } = useNotification();

  // Ya no necesitamos: count, setNotifications local, addNotification local, handleNotificationClick

  // Función para obtener el color del borde izquierdo según el tipo (se mantiene)
  const getBorderColor = (type: NotificationMessage["type"]): string => {
    const colors = {
      info: "#0dcaf0",
      warning: "#ffc107",
      error: "#dc3545",
      success: "#198754",
    };
    return colors[type] || colors.info;
  };

  return (
    <div className={`${styles.layout}`}>
      <PollingOrchestrator />

      {/* Contenedor de notificaciones - posición inferior derecha */}
      {/* Ahora mapea sobre las 'notifications' del NotificacionContext */}
      <div className="position-fixed bottom-20 end-10" style={{ zIndex: 1100 }}>
        {notifications.map(
          (
            notification // 'notification' ahora es de tipo NotificationMessage
          ) => (
            <div
              key={notification.id}
              style={{
                width: "400px",
                minHeight: "100px", // Ajustado minHeight, puede ser más dinámico
                backgroundColor: "#333",
                color: "white",
                marginBottom: "15px",
                position: "relative",
                borderLeft: `5px solid ${getBorderColor(notification.type)}`,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "4px",
              }}
            >
              <button
                onClick={() => removeNotification(notification.id)} // Usa removeNotification del contexto
                style={{
                  position: "absolute",
                  top: "10px", // Ajustado para mejor estética
                  right: "10px", // Ajustado para mejor estética
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.2rem", // Ajustado
                  cursor: "pointer",
                  opacity: "0.7",
                  transition: "opacity 0.2s",
                  lineHeight: "1",
                  padding: "5px", // Mejor área de click
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                &times;
              </button>
              <div>
                {/* NotificacionContext tiene 'message' y 'details'. No 'title' o 'subtitle' directamente. */}
                {/* Usaremos 'message' como el contenido principal. */}
                <p
                  style={{
                    marginBottom: "5px", // Reducido si no hay título
                    color: "#eee", // Un poco más claro para el mensaje principal
                    fontSize: "1.1rem", // Ajustado
                    fontWeight: "normal",
                    wordWrap: "break-word", // Para mensajes largos
                  }}
                >
                  {notification.message}
                </p>
                {/* Si notification.details existe, lo mostramos */}
                {notification.details && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#bbb", // Más tenue para detalles
                      fontSize: "0.9rem",
                      fontWeight: "lighter",
                      wordWrap: "break-word", // Para detalles largos
                    }}
                  >
                    {notification.details}
                  </p>
                )}
              </div>
              {/* El timestamp no está en NotificationMessage, NotificacionContext lo maneja internamente para auto-remover */}
              {/* Si necesitas mostrar un timestamp, tendrías que añadirlo a NotificationMessage */}
            </div>
          )
        )}
      </div>

      <nav className="w-full navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top">
        <a className={`navbar-brand ${styles.brand}`} href="/">
          Proyecto M
        </a>
        <div className="navbar-collapse justify-content-end p-2">
          <ul className="navbar-nav">
            <li className="nav-item w-25">
              {" "}
              {/* Estas clases w-25 parecen mucho para cada item */}
              <a className={`nav-link p-2 ${styles.nav_link}`}>Home</a> {/* Removido w-50 innecesario aquí */}
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 ${styles.nav_link}`}>About</a>
            </li>
            <li className="nav-item w-25">
              <a className={`nav-link p-2 ${styles.nav_link}`}>Services</a>
            </li>
            {/* El botón de "Notifications" que generaba las locales ha sido removido */}
            <li className="nav-item w-25">
              <a className={`nav-link p-2 ${styles.nav_link}`} onClick={onLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="d-flex h-full">
        <div
          className={`flex-shrink-0 bg-dark text-white h-screen col-lg-4 col-sm-2 sticky-top ${styles.sidebar}`}
          style={{ width: "250px" }}
        >
          <div className="nav flex-column">
            <Link
              to="/dashboard"
              className={`w-auto nav-link text-white px-3 py-2 ${styles.side_options}`} // w-auto o specific width
            >
              Dashboard
            </Link>
            <Link to="/agents" className={`w-auto nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Actividad
            </Link>
            <Link to="/estadisticas" className={`w-auto nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Estadisticas
            </Link>
            <Link to="/tools" className={`w-auto nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Analisis
            </Link>
            <Link to="/settings" className={`w-auto nav-link text-white px-3 py-2 ${styles.side_options}`}>
              Configuración
            </Link>
          </div>
        </div>

        <div className={`mb-5 ${styles.content}`}>
          <div
            className="col-lg-11 col-md-10 col-sm-8 m-3 p-2 bg-light border border-rounded"
            style={{ borderRadius: "15px" }}
          >
            {children}
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" defer></script>
    </div>
  );
};

export default Layout;
