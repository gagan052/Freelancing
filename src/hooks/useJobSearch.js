import { useQuery } from 'react-query';
import api from '../services/api';

export function useJobSearch(filters) {
  return useQuery(
    ['jobs', filters],
    async () => {
      const { data } = await api.get('/jobs', { params: filters });
      return data;
    },
    {
      keepPreviousData: true,
    }
  );
} 