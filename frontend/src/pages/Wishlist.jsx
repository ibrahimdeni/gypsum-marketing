import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center dark:bg-gray-950">
        <span className="text-8xl">❤️</span>
        <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">{t('wishlist_empty')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xl mb-8">{t('wishlist_empty_desc')}</p>
        <Link to="/products" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
          {t('cart_browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 dark:bg-gray-950">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">❤️ {t('wishlist_title')}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 hover:shadow-lg transition">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-full h-full flex items-center justify-center text-3xl">🏗️</div>
                )}
              </div>
              <div className="flex-grow">
                <Link to={`/products/${product._id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">{product.name}</Link>
                <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">Rp {product.price?.toLocaleString()}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addToCart(product, 1)} className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    🛒 {t('products_add_cart')}
                  </button>
                  <button onClick={() => removeFromWishlist(product._id)} className="px-4 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm">
                    {t('wishlist_remove')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;