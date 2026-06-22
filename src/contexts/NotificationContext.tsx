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

const createMockNotifications = (role?: string): AppNotification[] => {
  const now = Date.now();
  const base: AppNotification[] = [
    {
      id: 'stub-notif-order-delivered',
      title: 'Livrable disponible',
      description: 'Aline a depose un livrable pour votre commande de correction.',
      type: 'order',
      link: '/mes-commandes',
      read: false,
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
    },
    {
      id: 'stub-notif-message',
      title: 'Nouveau message',
      description: 'Un message client attend une reponse dans le chat de mission.',
      type: 'message',
      link: role === 'student' ? '/mes-missions' : '/mes-commandes',
      read: false,
      createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
    },
  ];

  if (role === 'student') {
    return [
      ...base,
      {
        id: 'stub-notif-proposal',
        title: 'Proposition acceptee',
        description: 'Une de vos propositions est devenue une mission active.',
        type: 'proposal',
        link: '/mes-propositions',
        read: true,
        createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  return base;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const storageKey = `notifs_${user?.id || 'guest'}`;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setNotifications(user ? createMockNotifications(user.role) : []);
  }, [storageKey, user]);

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
