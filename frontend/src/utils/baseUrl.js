/**
 * Get image URL yang fleksibel
 * Handle berbagai format:
 * - http://localhost:5000/uploads/xxx.jpg → /uploads/xxx.jpg
 * - /uploads/xxx.jpg → /uploads/xxx.jpg
 * - https://domain.com/uploads/xxx.jpg → /uploads/xxx.jpg (via proxy)
 * - null/undefined → ''
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // Kalau udah relative, return apa adanya
  if (url.startsWith('/uploads/')) return url;
  if (url.startsWith('/api/')) return url;
  
  // Kalau ada http://localhost:5000, replace jadi relative
  if (url.includes('localhost:5000')) {
    return url.replace(/https?:\/\/localhost:5000/, '');
  }
  
  // Kalau full URL dari domain lain, return apa adanya (production)
  if (url.startsWith('http')) {
    // Extract pathname aja untuk development
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }
  
  return url;
};

/**
 * Get full URL untuk upload (dipakai saat UPLOAD gambar)
 */
export const getUploadUrl = (url) => {
  if (!url) return '';
  // Di development, tambahin localhost
  if (window.location.hostname === 'localhost') {
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
  }
  return url;
};