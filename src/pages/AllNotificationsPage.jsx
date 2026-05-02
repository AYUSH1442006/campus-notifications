

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import PaginationBar from '../components/PaginationBar';
import { LoadingState, ErrorState, EmptyState } from '../components/FeedbackStates';

import { filterByType, sortByLatest, paginate } from '../utils/notificationUtils';
import { useNotifications } from '../hooks/useNotifications';
import logger from '../logging_middleware/logger';

export default function AllNotificationsPage() {
  const { notifications, loading, error, refresh, markSeen, isSeen } = useNotifications();

  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Apply filter + sort
  const filtered = useMemo(() => {
    const f = filterByType(notifications, filter);
    return sortByLatest(f);
  }, [notifications, filter]);

  // Paginate
  const { items, totalPages, total } = useMemo(
    () => paginate(filtered, page, limit),
    [filtered, page, limit]
  );

  // Reset to page 1 when filter or limit changes
  useEffect(() => { setPage(1); }, [filter, limit]);

  // Auto-mark visible notifications as seen
  

  const unseenCount = notifications.filter((n) => !isSeen(n.id)).length;

  const handleMarkAllSeen = () => {
    markSeen(notifications.map((n) => n.id));
    logger.action('MARK_ALL_SEEN', { total: notifications.length });
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            All Notifications
          </Typography>
          {unseenCount > 0 && (
            <Typography variant="body2" color="secondary.main" fontWeight={700}>
              {unseenCount} unread
            </Typography>
          )}
        </Box>

        <Box display="flex" gap={1}>
          {unseenCount > 0 && (
            <Tooltip title="Mark all as seen">
              <Button
                size="small"
                variant="outlined"
                startIcon={<MarkEmailReadIcon />}
                onClick={handleMarkAllSeen}
              >
                Mark all seen
              </Button>
            </Tooltip>
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { logger.action('MANUAL_REFRESH'); refresh(); }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filter bar */}
      <Box mb={2}>
        <FilterBar activeFilter={filter} onChange={setFilter} />
      </Box>

      {/* States */}
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState message={`No ${filter === 'All' ? '' : filter + ' '}notifications found.`} />
      )}

      {/* List */}
      {!loading && !error && items.map((n) => (
        <NotificationCard
          key={n.id}
          notification={n}
          seen={isSeen(n.id)}
          onView={(id) => markSeen([id])}
        />
      ))}

      {/* Pagination */}
      {!loading && !error && total > 0 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          total={total}
        />
      )}
    </Box>
  );
}
