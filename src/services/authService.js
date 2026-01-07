/**
 * Authentication Service
 * Handles login, token management, and API authentication
 */

import { API_URL } from '../config/apiConfig';

/**
 * Login user with username and password
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise<{success: boolean, token?: string, message: string}>}
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      // Save token to localStorage
      saveToken(data.token);
      return {
        success: true,
        token: data.token,
        message: 'Login successful',
      };
    }

    return {
      success: false,
      message: data.message || 'Login failed',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem('auth_token', token);
  // Also set isAuthenticated flag for backward compatibility
  localStorage.setItem('isAuthenticated', 'true');
};

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Delete JWT token from localStorage (logout)
 */
export const deleteToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Get Authorization header with Bearer token
 * @returns {object} - Authorization header object
 */
export const getAuthHeader = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Get all headers including auth
 * @returns {object} - Headers object with Content-Type and Authorization
 */
export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Logout user by removing token
 */
export const logout = () => {
  deleteToken();
};

/**
 * Refresh token from server (for future implementation)
 * @returns {Promise<{success: boolean, token?: string}>}
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      saveToken(data.token);
      return {
        success: true,
        token: data.token,
      };
    }

    // If refresh fails, logout user
    logout();
    return {
      success: false,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
    return {
      success: false,
    };
  }
};

/**
 * Decode JWT token to get payload (without verification)
 * NOTE: This decodes the token but does NOT verify its signature.
 * Signature verification must happen on the server.
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * Check if token has expired
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) {
    return true;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, convert to milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime > expirationTime;
};

/**
 * Get current user info from token
 * @returns {object|null} - User info or null if not authenticated
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  return {
    id: decoded.user_id,
    username: decoded.username,
    role: decoded.role,
    expiresAt: new Date(decoded.exp * 1000),
  };
};

export default {
  login,
  logout,
  saveToken,
  getToken,
  deleteToken,
  getAuthHeader,
  getAuthHeaders,
  isAuthenticated,
  refreshToken,
  decodeToken,
  isTokenExpired,
  getCurrentUser,
};
