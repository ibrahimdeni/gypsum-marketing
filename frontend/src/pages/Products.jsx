import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';
import LazyImage from '../components/LazyImage';
import { getImageUrl } from '../utils/baseUrl';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();

  useEffect(() => { fetchProducts(); }, [category]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const { data } = await axios.get(`/api/products?${params}`);
      setProducts(data.data || []);
    } catch (error) { console.error('Error fetching products:', error); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchProducts(); };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result) {
      Toast.cartAdded(product.name);
    } else {
      Toast.loginRequired();
    }
  };

  const handleWishlist = async (product) => {
    const wasInWishlist = isInWishlist(product._id);
    const result = await addToWishlist(product);
    if (result) {
      if (!wasInWishlist) {
        Toast.wishlistAdded(product.name);
      } else {
        Toast.wishlistRemoved();
      }
    } else {
      Toast.loginRequired();
    }
  };

  const categories = [
    { value: 'all', label: t('products_all') },
    { value: 'gypsum-board', label: t('products_category_board') },
    { value: 'gypsum-powder', label: t('products_category_powder') },
    { value: 'ceiling-tiles', label: t('products_category_ceiling') },
    { value: 'cornice', label: t('products_category_cornice') },
    { value: 'compound', label: t('products_category_compound') },
    { value: 'accessories', label: t('products_category_accessories') }
  ];

  return (
    <div className="dark:bg-gray-950">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">{t('products_title')}</h1>
        <p className="text-xl text-blue-100">{t('products_subtitle')}</p>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" placeholder={t('products_search')} value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔍</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg transition text-sm ${category === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>{cat.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? products.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl transition group">
              <Link to={`/products/${product._id}`}>
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <LazyImage
                      src={getImageUrl(product.images[0]?.url)}
                      alt={product.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-full h-full flex items-center justify-center text-6xl group-hover:scale-105 transition">🏗️</div>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">{product.name}</h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">{product.description?.slice(0, 80)}...</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rp {product.price?.toLocaleString()}</span>
                  <span className={`text-sm px-2 py-1 rounded ${product.stock > 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                    {t('products_stock')}: {product.stock || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* ✅ TOMBOL ADD TO CART - SEKARANG PAKE handleAddToCart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:bg-gray-400"
                  >
                    🛒 {t('products_add_cart')}
                  </button>

                  {/* ✅ TOMBOL WISHLIST - SEKARANG PAKE handleWishlist */}
                  <button
                    onClick={() => handleWishlist(product)}
                    className={`px-3 py-2 border-2 rounded-lg transition text-lg ${isInWishlist(product._id) ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-red-500'
                      }`}
                  >
                    {isInWishlist(product._id) ? '❤️' : '🤍'}
                  </button>

                  <Link to={`/products/${product._id}`}
                    className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition text-lg">👁️</Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl text-gray-400 dark:text-gray-500 mb-4">{t('products_no_results')}</p>
              <button onClick={() => { setCategory('all'); setSearch(''); }} className="text-blue-600 dark:text-blue-400 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;