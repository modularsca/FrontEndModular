import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface NotificationMessage {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  details?: string;
  silent?: boolean;
}
interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (
    message: string,
    type: NotificationMessage["type"],
    details?: string
  ) => void;
  initializeNotifications: (
    message: string,
    type: NotificationMessage["type"],
    details?: string
  ) => void;
  removeNotification: (id: string) => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ... (implementación del provider)
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const addNotification = useCallback(
    (message: string, type: NotificationMessage["type"], details?: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message, type, details }]);
      // Auto-remover notificación después de un tiempo si no usas react-toastify u similar
      setTimeout(() => removeNotification(id), 7000);
    },
    []
  );
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const initializeNotifications = useCallback(
    (message: string, type: NotificationMessage["type"], details?: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message, type, details, silent: true }]);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        initializeNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
};
