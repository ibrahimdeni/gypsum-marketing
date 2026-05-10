// Auto-detect API URL
const isLocalhost = window.location.hostname === 'localhost';
export const API_URL = isLocalhost 
  ? '' 
  : `http://${window.location.hostname}:5000`;

console.log('API URL:', API_URL);