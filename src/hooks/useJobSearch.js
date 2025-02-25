import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const useJobSearch = (query = '') => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        let supabaseQuery = supabase
          .from('jobs')
          .select('*');

        if (query) {
          supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
        }

        const { data, error } = await supabaseQuery;
        
        if (error) throw error;
        setJobs(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  return { jobs, loading, error };
}; 