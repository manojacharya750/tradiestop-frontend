import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { Notification } from '../types';

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const userNotifications = await api.fetchNotificationsForUser();
      setNotifications(userNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Poll for new notifications every 15 seconds to simulate real-time updates
      const intervalId = setInterval(fetchNotifications, 15000);
      return () => clearInterval(intervalId);
    } else {
      setNotifications([]);
    }
  }, [currentUser, fetchNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
        await api.markNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
        console.error("Failed to mark notifications as read", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, isLoading, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
