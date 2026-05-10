import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/baseUrl';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/featured');
      setFeaturedProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <>
      <SEO
        title="GypsumPro - Premium Quality Gypsum Products"
        description="Professional gypsum supplier with premium quality products. Gypsum boards, ceiling tiles, cornice, and accessories."
        keywords="gypsum, gypsum board, ceiling tiles, building materials, construction"
      />
      <div className="dark:bg-gray-950">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('home_hero_title')}</h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">{t('home_hero_subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-100 transition font-semibold text-lg">
                {t('home_hero_explore')}
              </Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-semibold text-lg">
                {t('home_hero_contact')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">{t('home_why_title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "🛡️", title: t('home_feature_quality'), desc: t('home_feature_quality_desc') },
                { icon: "🚚", title: t('home_feature_delivery'), desc: t('home_feature_delivery_desc') },
                { icon: "⭐", title: t('home_feature_team'), desc: t('home_feature_team_desc') },
                { icon: "💬", title: t('home_feature_support'), desc: t('home_feature_support_desc') }
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 text-center hover:shadow-xl transition">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { number: "1,250+", label: "Projects" },
                { number: "500+", label: "Clients" },
                { number: "15+", label: "Years" },
                { number: "200+", label: "Products" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-20 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">{t('products_title')}</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12">{t('products_subtitle')}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 4).map(product => (
                  <Link to={`/products/${product._id}`} key={product._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl transition group">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl group-hover:scale-105 transition">
                      {product.images?.[0]?.url ? <img src={getImageUrl(product.images[0]?.url)} alt={product.name} className="w-full h-full object-cover" /> : '🏗️'}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{product.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-xl">Rp {product.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home_cta_title')}</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100">{t('home_cta_subtitle')}</p>
            <Link to="/contact" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-100 transition font-semibold text-lg">
              {t('home_cta_button')}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;