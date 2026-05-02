

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl,
  InputLabel, Chip, Divider, Button,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';

import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import { LoadingState, ErrorState, EmptyState } from '../components/FeedbackStates';

import { sortByPriority, filterByType } from '../utils/notificationUtils';
import { useNotifications } from '../hooks/useNotifications';
import logger from '../logging_middleware/logger';

const TOP_N_OPTIONS = [10, 15, 20];

const PRIORITY_LEGEND = [
  { label: 'Placement', color: '#7c4dff', Icon: WorkIcon, rank: 1 },
  { label: 'Result',    color: '#f57c00', Icon: SchoolIcon, rank: 2 },
  { label: 'Event',     color: '#0288d1', Icon: EventIcon, rank: 3 },
];

export default function PriorityNotificationsPage() {
  const { notifications, loading, error, refresh, markSeen, isSeen } = useNotifications();

  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState('All');

  // Sort by priority → apply filter → slice top N
  const prioritized = useMemo(() => {
    const sorted = sortByPriority(notifications);
    const filtered = filterByType(sorted, filter);
    return filtered.slice(0, topN);
  }, [notifications, topN, filter]);

  // Auto-mark as seen
  useEffect(() => {
    if (prioritized.length > 0) {
      markSeen(prioritized.map((n) => n.id));
    }
  }, [prioritized, markSeen]);

  const handleTopNChange = (e) => {
    const val = Number(e.target.value);
    logger.action('PRIORITY_TOP_N_CHANGED', { topN: val });
    setTopN(val);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon sx={{ color: '#f57c00', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="primary.main">
              Priority Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placement &rsaquo; Result &rsaquo; Event · latest first within each type
            </Typography>
          </Box>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => { logger.action('PRIORITY_MANUAL_REFRESH'); refresh(); }}
        >
          Refresh
        </Button>
      </Box>

      {/* Priority Legend */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {PRIORITY_LEGEND.map(({ label, color, rank }) => (
          <Chip
            key={label}
            label={`#${rank} ${label}`}
            size="small"
            sx={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}55`,
              fontWeight: 700,
            }}
          />
        ))}
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
        <FilterBar activeFilter={filter} onChange={setFilter} />

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show Top</InputLabel>
          <Select value={topN} label="Show Top" onChange={handleTopNChange}>
            {TOP_N_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>Top {n}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* States */}
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && prioritized.length === 0 && (
        <EmptyState message="No priority notifications found." />
      )}

      {/* Prioritized list */}
      {!loading && !error && prioritized.map((n, idx) => (
        <Box key={n.id} position="relative">
          {/* Rank badge */}
          <Chip
            label={`#${idx + 1}`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8, right: 8,
              zIndex: 1,
              background: '#1a237e',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.68rem',
              height: 20,
            }}
          />
          <NotificationCard
            notification={n}
            seen={isSeen(n.id)}
            onView={(id) => markSeen([id])}
          />
        </Box>
      ))}

      {!loading && !error && prioritized.length > 0 && (
        <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
          Showing {prioritized.length} of {notifications.length} notifications
        </Typography>
      )}
    </Box>
  );
}
