import { useState, useEffect, useCallback } from 'react';
import { visitorService } from '../lib/services';

// Usage:
//   const { visitors, pagination, loading, error, refetch, checkIn, checkOut } =
//     useVisitors({ page: 1, limit: 20, status: 'checked-in', search: '' });
export function useVisitors(params = {}) {
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringify so the effect only re-runs when the actual filter values change,
  // not on every render (params is a new object literal each render otherwise).
  const paramsKey = JSON.stringify(params);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitorService.list(JSON.parse(paramsKey));
      setVisitors(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const checkIn = useCallback(
    async (payload) => {
      const newVisitor = await visitorService.checkIn(payload);
      await fetchVisitors(); // refresh list so pagination/counts stay accurate
      return newVisitor;
    },
    [fetchVisitors]
  );

  const checkOut = useCallback(
    async (id) => {
      const updated = await visitorService.checkOut(id);
      setVisitors((prev) => prev.map((v) => (v._id === id ? updated : v)));
      return updated;
    },
    []
  );

  const remove = useCallback(
    async (id) => {
      await visitorService.remove(id);
      setVisitors((prev) => prev.filter((v) => v._id !== id));
    },
    []
  );

  return { visitors, pagination, loading, error, refetch: fetchVisitors, checkIn, checkOut, remove };
}
