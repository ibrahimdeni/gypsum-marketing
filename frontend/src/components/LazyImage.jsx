import React, { useState, useRef, useEffect } from 'react';
import { getImageUrl } from '../utils/baseUrl';

const LazyImage = ({ src, alt, className = '', placeholderClassName = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder blur */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${placeholderClassName}`}>
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            🏗️
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;