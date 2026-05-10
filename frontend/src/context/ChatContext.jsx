import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.get('/api/chat/unread', getConfig());
      setUnreadCount(data.data?.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated, user?._id]);

  // Fetch every 10 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?._id, fetchUnreadCount]);

  return (
    <ChatContext.Provider value={{ unreadCount, fetchUnreadCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatContext;