import { createContext, useContext, useEffect, useMemo, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("travelai_notifications");
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "travelai_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  const addNotification = (payload) => {
    const next = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: payload.title || "Notification",
      description: payload.description || "New activity available.",
      type: payload.type || "info",
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => [next, ...current].slice(0, 20));
  };

  const markRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const value = useMemo(
    () => ({ notifications, addNotification, markRead, markAllRead, unreadCount }),
    [notifications, unreadCount],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
