import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none border border-gray-300 dark:border-gray-600"
      style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
      title={isDark ? 'Switch to Light' : 'Switch to Dark'}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center text-xs ${
          isDark ? 'left-7 bg-gray-700' : 'left-0.5 bg-white'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;