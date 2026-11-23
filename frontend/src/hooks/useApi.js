import { useEffect, useState } from 'react';
import { fetchOnce } from '../services/api';

// { data, loading, failed }. data stays null until it has arrived.
const useApi = (path) => {
  const [state, setState] = useState({ data: null, loading: true, failed: false });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, failed: false });
    fetchOnce(path)
      .then(data => active && setState({ data, loading: false, failed: false }))
      .catch(err => {
        console.error(`Failed to load ${path}:`, err.message);
        if (active) setState({ data: null, loading: false, failed: true });
      });
    return () => { active = false; };
  }, [path]);

  return state;
};

// Like useApi, for addresses that return a list.
export const useList = (path) => {
  const { data, loading, failed } = useApi(path);
  return { items: Array.isArray(data) ? data : [], loading, failed };
};

export default useApi;
