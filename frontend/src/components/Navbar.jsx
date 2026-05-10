import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { unreadCount } = useChat();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Gypsum<span className="text-blue-600 dark:text-blue-400">Pro</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-sm">
              {t('nav_home')}
            </Link>
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-sm">
              {t('nav_products')}
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-sm">
              {t('nav_contact')}
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/wishlist" className="relative text-gray-700 dark:text-gray-300 hover:text-red-500 transition">
                  <span className="text-xl">❤️</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/chat" className="relative text-gray-700 dark:text-gray-300 hover:text-green-600 transition">
                  <span className="text-xl">💬</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin/chat" className="relative text-gray-700 dark:text-gray-300 hover:text-green-600 transition">
                <span className="text-xl">💬</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            <ThemeToggle />
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="text-sm hidden lg:block">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">{user?.role}</p>
                </div>
                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs">📊 {t('nav_dashboard')}</Link>
                    <Link to="/admin/inventory" className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-xs">📦 {t('nav_inventory')}</Link>
                  </>
                )}
                <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-xs">{t('nav_logout')}</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition font-medium text-sm">{t('nav_signin')}</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">{t('nav_signup')}</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link to="/" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>{t('nav_home')}</Link>
            <Link to="/products" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>{t('nav_products')}</Link>
            <Link to="/contact" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>{t('nav_contact')}</Link>

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/cart" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>🛒 {t('nav_cart')} ({cartCount})</Link>
                    <Link to="/wishlist" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>❤️ {t('nav_wishlist')} ({wishlist.length})</Link>
                    <Link to="/chat" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>💬 {t('nav_chat')}</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="block py-2 text-blue-600 font-medium" onClick={() => setIsOpen(false)}>📊 {t('nav_dashboard')}</Link>
                    <Link to="/admin/inventory" className="block py-2 text-green-600 font-medium" onClick={() => setIsOpen(false)}>📦 {t('nav_inventory')}</Link>
                    <Link to="/admin/chat" className="block py-2 text-blue-600 font-medium" onClick={() => setIsOpen(false)}>💬 {t('nav_admin_chat')}</Link>
                  </>
                )}
                <div className="border-t dark:border-gray-700 pt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user?.name}</p>
                  <button onClick={handleLogout} className="w-full py-2 bg-red-500 text-white rounded-lg">{t('nav_logout')}</button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                <Link to="/login" className="flex-1 py-2 text-center border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg" onClick={() => setIsOpen(false)}>{t('nav_signin')}</Link>
                <Link to="/signup" className="flex-1 py-2 text-center bg-blue-600 text-white rounded-lg" onClick={() => setIsOpen(false)}>{t('nav_signup')}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;