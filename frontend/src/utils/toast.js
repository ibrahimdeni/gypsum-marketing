import toast from 'react-hot-toast';

// Style dasar yang elegan
const baseStyle = {
  borderRadius: '14px',
  padding: '14px 20px',
  fontSize: '14px',
  fontWeight: '600',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  maxWidth: '400px',
};

const Toast = {
  // ============ SUCCESS ============
  success: (message, icon = '✅') => {
    return toast.success(message, {
      style: { ...baseStyle, background: '#059669', color: '#fff' },
      icon: icon,
      duration: 3000,
    });
  },

  // ============ ERROR ============
  error: (message, icon = '❌') => {
    return toast.error(message, {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: icon,
      duration: 4000,
    });
  },

  // ============ CART ============
  cartAdded: (productName) => {
    return toast.success(`${productName}`, {
      style: { ...baseStyle, background: '#2563EB', color: '#fff' },
      icon: '🛒',
      duration: 2500,
    });
  },

  cartRemoved: () => {
    return toast.success('Item removed from cart', {
      style: { ...baseStyle, background: '#6B7280', color: '#fff' },
      icon: '🗑️',
      duration: 2000,
    });
  },

  cartCleared: () => {
    return toast.success('Cart cleared', {
      style: { ...baseStyle, background: '#6B7280', color: '#fff' },
      icon: '🧹',
      duration: 2000,
    });
  },

  // ============ WISHLIST ============
  wishlistAdded: (productName) => {
    return toast.success(`${productName}`, {
      style: { ...baseStyle, background: '#DB2777', color: '#fff' },
      icon: '❤️',
      duration: 2000,
    });
  },

  wishlistRemoved: () => {
    return toast.success('Removed from wishlist', {
      style: { ...baseStyle, background: '#6B7280', color: '#fff' },
      icon: '💔',
      duration: 2000,
    });
  },

  // ============ AUTH ============
  loginSuccess: (userName) => {
    return toast.success(`Welcome back, ${userName}!`, {
      style: { ...baseStyle, background: '#7C3AED', color: '#fff' },
      icon: '👋',
      duration: 3000,
    });
  },

  loginError: () => {
    return toast.error('Invalid email or password', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '🔐',
      duration: 4000,
    });
  },

  registerSuccess: (userName) => {
    return toast.success(`Welcome, ${userName}! 🎉`, {
      style: { ...baseStyle, background: '#7C3AED', color: '#fff' },
      icon: '🚀',
      duration: 4000,
    });
  },

  registerError: (message) => {
    return toast.error(message || 'Registration failed', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '❌',
      duration: 4000,
    });
  },

  logout: () => {
    return toast.success('Logged out', {
      style: { ...baseStyle, background: '#6B7280', color: '#fff' },
      icon: '👋',
      duration: 2000,
    });
  },

  // ============ PRODUCTS (Admin) ============
  productCreated: () => {
    return toast.success('Product created successfully!', {
      style: { ...baseStyle, background: '#059669', color: '#fff' },
      icon: '✨',
      duration: 3000,
    });
  },

  productUpdated: () => {
    return toast.success('Product updated!', {
      style: { ...baseStyle, background: '#D97706', color: '#fff' },
      icon: '✏️',
      duration: 3000,
    });
  },

  productDeleted: () => {
    return toast.success('Product deleted', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '🗑️',
      duration: 2000,
    });
  },

  // ============ UPLOAD ============
  uploadSuccess: (count) => {
    return toast.success(`${count} image(s) uploaded!`, {
      style: { ...baseStyle, background: '#2563EB', color: '#fff' },
      icon: '📷',
      duration: 3000,
    });
  },

  uploadError: () => {
    return toast.error('Upload failed', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '❌',
      duration: 3000,
    });
  },

  // ============ STOCK ============
  stockUpdated: () => {
    return toast.success('Stock updated!', {
      style: { ...baseStyle, background: '#059669', color: '#fff' },
      icon: '📦',
      duration: 3000,
    });
  },

  stockError: (message) => {
    return toast.error(message || 'Failed to update stock', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '❌',
      duration: 4000,
    });
  },

  // ============ CONTACT ============
  contactSent: () => {
    return toast.success('Message sent! We\'ll contact you soon.', {
      style: { ...baseStyle, background: '#059669', color: '#fff' },
      icon: '📧',
      duration: 5000,
    });
  },

  contactError: () => {
    return toast.error('Failed to send message', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '❌',
      duration: 4000,
    });
  },

  // ============ CHAT ============
  chatSent: () => {
    return toast.success('Message sent!', {
      style: { ...baseStyle, background: '#2563EB', color: '#fff' },
      icon: '✈️',
      duration: 1500,
    });
  },

  chatError: () => {
    return toast.error('Failed to send message', {
      style: { ...baseStyle, background: '#DC2626', color: '#fff' },
      icon: '❌',
      duration: 3000,
    });
  },

  // ============ CHECKOUT ============
  orderPlaced: () => {
    return toast.success('🎉 Order placed successfully!', {
      style: { ...baseStyle, background: '#059669', color: '#fff' },
      icon: '🎉',
      duration: 5000,
    });
  },

  // ============ GENERAL ============
  info: (message) => {
    return toast(message, {
      style: { ...baseStyle, background: '#6366F1', color: '#fff' },
      icon: '💡',
      duration: 4000,
    });
  },

  warning: (message) => {
    return toast(message, {
      style: { ...baseStyle, background: '#F59E0B', color: '#fff' },
      icon: '⚠️',
      duration: 4000,
    });
  },

  loginRequired: () => {
    return toast.error('Please login first! 🔐', {
      style: { ...baseStyle, background: '#6366F1', color: '#fff' },
      icon: '🔐',
      duration: 3000,
    });
  },
};

export default Toast;