

import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import logger from '../logging_middleware/logger';

const TYPES = ['All', 'Placement', 'Result', 'Event'];

const TYPE_COLORS = {
  All:       { selected: '#1a237e', bg: '#e8eaf6' },
  Placement: { selected: '#7c4dff', bg: '#f3efff' },
  Result:    { selected: '#f57c00', bg: '#fff3e0' },
  Event:     { selected: '#0288d1', bg: '#e1f5fe' },
};

export default function FilterBar({ activeFilter, onChange }) {
  const handleChange = (_, value) => {
    if (!value) return; // prevent de-select all
    logger.action('FILTER_CHANGED', { from: activeFilter, to: value });
    onChange(value);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Filter:
      </Typography>
      <ToggleButtonGroup
        value={activeFilter}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{ flexWrap: 'wrap', gap: 0.5 }}
      >
        {TYPES.map((type) => {
          const cfg = TYPE_COLORS[type];
          return (
            <ToggleButton
              key={type}
              value={type}
              sx={{
                border: '1.5px solid #e0e0e0 !important',
                borderRadius: '20px !important',
                px: 2,
                py: 0.4,
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  background: cfg.bg,
                  color: cfg.selected,
                  border: `1.5px solid ${cfg.selected} !important`,
                },
              }}
            >
              {type}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}
