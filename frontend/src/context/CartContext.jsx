import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Ambil token setiap kali diperlukan (biar selalu fresh)
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]); // Depend on user ID, not whole object

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart', getConfig());
      setCart(data.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If unauthorized, clear cart
      if (error.response?.status === 401) {
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) return false;
    
    try {
      const { data } = await axios.post('/api/cart/add', 
        { productId: product._id, quantity }, getConfig()
      );
      console.log('📦 CART API RESPONSE:', data); // ← TAMBAHKAN INI
      setCart(data.data || []);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`, getConfig());
      setCart(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    try {
      const { data } = await axios.put('/api/cart/update', 
        { productId, quantity }, getConfig()
      );
      setCart(data.data || []);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear', getConfig());
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, removeFromCart, updateQuantity, 
      clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;