import axios from 'axios';

// REACT_APP_API_URL may be given with or without a trailing slash or /api.
export const API_URL = (import.meta.env.REACT_APP_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (url) => {
  if (!url) return null;
  if (/^(https?|blob|data):/.test(url)) return url;
  return `${API_URL}/${url.replace(/^\/+/, '')}`;
};

// "github.com/me" -> "https://github.com/me", nothing -> null
export const externalUrl = (url) => {
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
};

const requests = new Map();

// Several sections need the same data, so each address is requested once per visit.
export const fetchOnce = (path) => {
  if (!requests.has(path)) {
    requests.set(path, api.get(path)
      .then(res => {
        if (!res.data || typeof res.data !== 'object') throw new Error(`Unexpected response from ${path}`);
        return res.data;
      })
      .catch(err => {
        requests.delete(path);
        throw err;
      }));
  }
  return requests.get(path);
};

export default api;
