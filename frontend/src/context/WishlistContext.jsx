import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist', getConfig());
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ TOGGLE: add if not exists, remove if exists
  const addToWishlist = async (product) => {
    if (!isAuthenticated) return false;
    
    const isAlreadyInWishlist = wishlist.some(item => item._id === product._id);
    
    try {
      if (isAlreadyInWishlist) {
        // REMOVE
        const { data } = await axios.delete(
          `/api/wishlist/remove/${product._id}`, getConfig()
        );
        setWishlist(data.data || []);
        return true;
      } else {
        // ADD
        const { data } = await axios.post('/api/wishlist/add', 
          { productId: product._id }, getConfig()
        );
        setWishlist(data.data || []);
        return true;
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(
        `/api/wishlist/remove/${productId}`, getConfig()
      );
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const clearWishlist = async () => {
    try {
      await axios.delete('/api/wishlist/clear', getConfig());
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist, loading, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export default WishlistContext;