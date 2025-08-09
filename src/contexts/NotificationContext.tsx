import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'system' | 'payment' | 'shipping';
  relatedId?: string;
};

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let CapacitorPush: any = null;
if (typeof window !== 'undefined') {
  try {
    CapacitorPush = require('@capacitor/push-notifications').PushNotifications;
  } catch {}
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`notifications_${user.id}`);
    if (stored) {
      setNotifications(JSON.parse(stored).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
    }
  }, [user]);

  // Persist notifications to localStorage
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`notifications_${user.id}`,
      JSON.stringify(notifications)
    );
  }, [notifications, user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;
    setNotifications(prev => [
      {
        ...notification,
        id: `n-${Date.now()}`,
        timestamp: new Date(),
        read: false,
        userId: user.id
      },
      ...prev
    ]);
    // Send push notification if on mobile
    if (CapacitorPush) {
      CapacitorPush.createChannel && CapacitorPush.createChannel({ id: 'default', name: 'Default' });
      CapacitorPush.scheduleLocalNotification && CapacitorPush.scheduleLocalNotification({
        title: notification.title,
        body: notification.message,
        id: Date.now(),
        channelId: 'default',
        smallIcon: 'ic_stat_icon_config_sample',
        actionTypeId: '',
        extra: notification.relatedId ? { relatedId: notification.relatedId } : undefined
      });
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification, markAsRead, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}; 