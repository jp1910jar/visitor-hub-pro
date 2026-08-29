import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../lib/services';

// Usage:
//   const { summary, trend, byPurpose, topHosts, loading, error, refetch } =
//     useDashboardData({ trendDays: 14, topHostsLimit: 5 });
export function useDashboardData({ trendDays = 14, topHostsLimit = 5 } = {}) {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [byPurpose, setByPurpose] = useState([]);
  const [topHosts, setTopHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fire all four requests in parallel - they're independent
      const [summaryRes, trendRes, purposeRes, hostsRes] = await Promise.all([
        dashboardService.summary(),
        dashboardService.trend(trendDays),
        dashboardService.byPurpose(),
        dashboardService.topHosts(topHostsLimit),
      ]);
      setSummary(summaryRes);
      setTrend(trendRes);
      setByPurpose(purposeRes);
      setTopHosts(hostsRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [trendDays, topHostsLimit]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, trend, byPurpose, topHosts, loading, error, refetch: fetchAll };
}
