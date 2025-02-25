import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Update unread count whenever notifications change
    const newUnreadCount = notifications.filter(n => !n.read).length;
    setUnreadCount(newUnreadCount);
  }, [notifications]);

  const fetchNotifications = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      fetchNotifications, 
      markAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext); 