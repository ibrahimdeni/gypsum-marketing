import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <span>{language === 'id' ? '🇮🇩' : '🇬🇧'}</span>
      <span>{language === 'id' ? 'ID' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;