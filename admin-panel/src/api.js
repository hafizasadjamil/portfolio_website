import axios from 'axios';

// REACT_APP_API_URL may be given with or without a trailing slash or /api.
export const API_URL = (import.meta.env.REACT_APP_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export const getImageUrl = url => {
  if (!url) return null;
  if (/^(https?|blob|data):/.test(url)) return url;
  return `${API_URL}/${url.replace(/^\/+/, '')}`;
};

// The server's explanation if it sent one, otherwise the fallback text.
export const errorMessage = (err, fallback) => err.response?.data?.msg || fallback;

const LOGOUT_EVENT = 'admin-logout';

export const onLogout = handler => {
  window.addEventListener(LOGOUT_EVENT, handler);
  return () => window.removeEventListener(LOGOUT_EVENT, handler);
};

export const logout = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event(LOGOUT_EVENT));
};

const decodeToken = token => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
};

// True if a token is stored and has not expired. The server still checks it on every request.
export const hasValidToken = () => {
  const token = localStorage.getItem('token');
  const payload = token && decodeToken(token);
  return Boolean(payload && payload.exp * 1000 > Date.now());
};

// An expired or rejected token sends the user back to the login page.
axios.interceptors.response.use(
  response => response,
  err => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && localStorage.getItem('token')) {
      logout();
    }
    return Promise.reject(err);
  }
);
