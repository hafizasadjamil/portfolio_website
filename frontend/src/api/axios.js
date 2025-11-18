import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;