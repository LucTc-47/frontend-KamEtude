import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'order' | 'proposal' | 'system';
  link: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const storageKey = `notifs_${user?.id || 'guest'}`;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setNotifications(saved ? JSON.parse(saved) : []);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  useEffect(() => {
    // TODO(backend): reconnecter les notifications temps reel via Spring Boot (SSE/WebSocket pour messages, commandes et propositions).
    return undefined;
  }, [user?.id]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = useMemo<NotificationContextType>(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  }), [notifications, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
