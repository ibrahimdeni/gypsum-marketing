import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon = '📭', title = 'No data', description = '', actionText = '', actionLink = '' }) => {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <span className="text-7xl block mb-6 animate-bounce">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">{description}</p>
        )}
        {actionText && actionLink && (
          <Link
            to={actionLink}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;