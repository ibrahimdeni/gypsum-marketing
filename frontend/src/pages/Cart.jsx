import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';
import { getImageUrl } from '../utils/baseUrl';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { t } = useLanguage();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center dark:bg-gray-950">
        <span className="text-8xl">🛒</span>
        <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">{t('cart_empty')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xl mb-8">{t('cart_empty_desc')}</p>
        <Link to="/products" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
          {t('cart_browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 dark:bg-gray-950">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🛒 {t('cart_title')}</h1>
        <button onClick={() => {
          clearCart();
          Toast.cartCleared();
        }} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
          {t('cart_clear')}
        </button>
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
              {item.images && item.images.length > 0 ? (
                <img src={getImageUrl(item.images[0]?.url)} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-full h-full flex items-center justify-center text-3xl">🏗️</div>
              )}
            </div>
            <div className="flex-grow">
              <Link to={`/products/${item._id}`} className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">{item.name}</Link>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">Rp {item.price?.toLocaleString()}</p>
            </div>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">-</button>
              <span className="px-4 py-1 font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">+</button>
            </div>
            <p className="font-bold text-lg min-w-[100px] text-right text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString()}</p>
            <button onClick={() => {
              removeFromCart(item._id);
              Toast.cartRemoved();
            }} className="text-red-400 hover:text-red-600 text-2xl">🗑️</button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 mt-8">
        <div className="flex justify-between items-center text-2xl font-bold mb-6">
          <span className="text-gray-900 dark:text-white">{t('cart_total')}</span>
          <span className="text-blue-600 dark:text-blue-400">Rp {cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex gap-4">
          <Link to="/products" className="flex-1 px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition font-semibold text-center">
            {t('cart_continue')}
          </Link>
          <Link to="/checkout" className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-center">
            {t('cart_checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;