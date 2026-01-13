/**
 * API Configuration
 * Determines the backend API URL based on environment
 */

// Get API URL from environment or determine based on hostname
const getApiUrl = () => {
  // In production on Amplify, use the full backend URL
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // If on Amplify subdomain or production custom domain, use production backend
  if (hostname.includes('amplifyapp.com') || hostname.includes('bellavistanursinghomes.com')) {
    return 'https://tx33akztgs.eu-west-2.awsapprunner.com/api';
  }
  
  // For localhost development, use relative path (Vite proxy)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }
  
  // Default: use relative path
  return '/api';
};

export const API_URL = getApiUrl();

export default {
  API_URL,
};
