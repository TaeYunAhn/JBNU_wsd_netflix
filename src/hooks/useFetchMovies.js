import { useState, useEffect } from 'react';
import TMDbAPI from '../services/URL';

const useFetchMovies = (apiMethod, dependency = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiMethod();
        setData(response.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, dependency);

  return { data, loading, error };
};

export default useFetchMovies;
