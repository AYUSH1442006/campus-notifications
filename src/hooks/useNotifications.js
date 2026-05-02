

import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../services/notificationService';
import { getSeenIds, markAsSeen } from '../utils/notificationUtils';
import logger from '../logging_middleware/logger';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seenIds, setSeenIds] = useState(getSeenIds);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.action('FETCH_NOTIFICATIONS', { trigger: 'mount_or_refresh' });
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // unseen id
  const markSeen = useCallback((ids) => {
    markAsSeen(ids);
    setSeenIds(getSeenIds());
  }, []);

  const isSeen = useCallback((id) => seenIds.has(String(id)), [seenIds]);

  return { notifications, loading, error, refresh: load, markSeen, isSeen };
}
