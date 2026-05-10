import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">🏗️ GypsumPro</h3>
            <p className="text-gray-400">{t('home_feature_quality_desc')}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">{t('nav_home')}</a></li>
              <li><a href="/products" className="hover:text-white transition">{t('nav_products')}</a></li>
              <li><a href="/contact" className="hover:text-white transition">{t('nav_contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('nav_contact')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@gypsumpro.com</li>
              <li>📱 +62 123 456 789</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} GypsumPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;