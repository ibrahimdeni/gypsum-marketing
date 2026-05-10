import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';

// Icons
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { unreadCount } = useChat();
  const { language, setLanguage } = useLanguage();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { theme, setTheme } = { theme: localStorage.getItem('theme') || 'light', setTheme: (t) => { localStorage.setItem('theme', t); document.documentElement.classList.toggle('dark', t === 'dark'); window.location.reload(); } };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) setAdminMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    Toast.logout();
    setUserMenuOpen(false);
    setAdminMenuOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* ===== LEFT: Logo ===== */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Gypsum<span className="text-blue-600 dark:text-blue-400">Pro</span>
            </span>
          </Link>

          {/* ===== CENTER: Nav Links (Desktop) ===== */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {t('nav_home')}
            </Link>
            <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {t('nav_products')}
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {t('nav_contact')}
            </Link>
          </div>

          {/* ===== RIGHT: Actions (Desktop) ===== */}
          <div className="hidden md:flex items-center space-x-0.5">
            
            {/* Cart & Wishlist - Customer only */}
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/wishlist" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" title="Wishlist">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {wishlist.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" title="Cart">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  {cartCount > 0 && <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                </Link>
                <Link to="/chat" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" title="Chat">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  {unreadCount > 0 && <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
                </Link>
              </>
            )}

            {/* Admin Chat Icon */}
            {isAdmin && (
              <Link to="/admin/chat" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" title="Chat">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
              </Link>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Theme Toggle - Icon Only */}
            <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Language Toggle - Icon Only */}
            <button onClick={toggleLanguage} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition font-semibold text-sm" title={language === 'id' ? 'English' : 'Bahasa Indonesia'}>
              {language === 'id' ? '🇮🇩' : '🇬🇧'}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* ========== AUTH AREA ========== */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                
                {/* Admin Dropdown */}
                {isAdmin && (
                  <div className="relative" ref={adminMenuRef}>
                    <button onClick={() => { setAdminMenuOpen(!adminMenuOpen); setUserMenuOpen(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                      <span>⚙️</span>
                      <span className="hidden lg:inline">Admin</span>
                      <ChevronDown />
                    </button>
                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                        <Link to="/admin/dashboard" onClick={() => setAdminMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">📊 Dashboard</Link>
                        <Link to="/admin/inventory" onClick={() => setAdminMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">📦 Inventory</Link>
                        <Link to="/admin/users" onClick={() => setAdminMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">👥 Users</Link>
                        <Link to="/admin/inquiries" onClick={() => setAdminMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">📧 Inquiries</Link>
                      </div>
                    )}
                  </div>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => { setUserMenuOpen(!userMenuOpen); setAdminMenuOpen(false); }}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user?.avatar ? <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full mt-1.5 inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">{user?.role}</span>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">👤 My Profile</Link>
                      {!isAdmin && (
                        <>
                          <Link to="/cart" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">🛒 Cart ({cartCount})</Link>
                          <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">❤️ Wishlist ({wishlist.length})</Link>
                          <Link to="/chat" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">💬 Chat</Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">🚪 {t('nav_logout')}</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">{t('nav_signin')}</Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">{t('nav_signup')}</Link>
              </div>
            )}
          </div>

          {/* ===== MOBILE TOGGLE ===== */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-300 rounded-lg">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={toggleLanguage} className="p-2 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm">
              {language === 'id' ? '🇮🇩' : '🇬🇧'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(false)}>{t('nav_home')}</Link>
            <Link to="/products" className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(false)}>{t('nav_products')}</Link>
            <Link to="/contact" className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(false)}>{t('nav_contact')}</Link>

            {isAuthenticated ? (
              <>
                <div className="border-t dark:border-gray-700 pt-2 mt-2"></div>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{user?.name?.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200" onClick={() => setIsOpen(false)}>👤 Profile</Link>
                {!isAdmin && (
                  <>
                    <Link to="/cart" className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200" onClick={() => setIsOpen(false)}>🛒 Cart ({cartCount})</Link>
                    <Link to="/wishlist" className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200" onClick={() => setIsOpen(false)}>❤️ Wishlist ({wishlist.length})</Link>
                    <Link to="/chat" className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200" onClick={() => setIsOpen(false)}>💬 Chat</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <div className="border-t dark:border-gray-700 pt-2 mt-2"></div>
                    <p className="px-3 text-xs text-gray-400 uppercase font-medium">Admin</p>
                    <Link to="/admin/dashboard" className="block px-3 py-2.5 text-sm text-blue-600 font-medium" onClick={() => setIsOpen(false)}>📊 Dashboard</Link>
                    <Link to="/admin/inventory" className="block px-3 py-2.5 text-sm text-green-600 font-medium" onClick={() => setIsOpen(false)}>📦 Inventory</Link>
                    <Link to="/admin/users" className="block px-3 py-2.5 text-sm text-purple-600 font-medium" onClick={() => setIsOpen(false)}>👥 Users</Link>
                    <Link to="/admin/inquiries" className="block px-3 py-2.5 text-sm text-yellow-600 font-medium" onClick={() => setIsOpen(false)}>📧 Inquiries</Link>
                  </>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-red-600 font-medium mt-2 border-t dark:border-gray-700 pt-2">🚪 Logout</button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2 border-t dark:border-gray-700 mt-2">
                <Link to="/login" className="flex-1 py-2.5 text-center text-sm font-medium border-2 border-blue-600 text-blue-600 rounded-lg" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link to="/signup" className="flex-1 py-2.5 text-center text-sm font-medium bg-blue-600 text-white rounded-lg" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;