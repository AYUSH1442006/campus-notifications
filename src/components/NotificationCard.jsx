

import React from 'react';
import {
  Card, CardContent, Box, Typography, Chip,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { formatTimestamp } from '../utils/notificationUtils';

const TYPE_CONFIG = {
  Placement: {
    color: '#7c4dff',
    bg: '#f3efff',
    border: '#d1c4e9',
    Icon: WorkIcon,
    label: 'Placement',
  },
  Result: {
    color: '#f57c00',
    bg: '#fff3e0',
    border: '#ffe0b2',
    Icon: SchoolIcon,
    label: 'Result',
  },
  Event: {
    color: '#0288d1',
    bg: '#e1f5fe',
    border: '#b3e5fc',
    Icon: EventIcon,
    label: 'Event',
  },
};

const DEFAULT_CONFIG = {
  color: '#607d8b',
  bg: '#eceff1',
  border: '#cfd8dc',
  Icon: EventIcon,
  label: 'Other',
};

export default function NotificationCard({ notification, seen = true, onView }) {
  const cfg = TYPE_CONFIG[notification.type] ?? DEFAULT_CONFIG;
  const { Icon } = cfg;

  return (
    <Card
      onClick={() => onView?.(notification.id)}
      sx={{
        mb: 1.5,
        cursor: 'pointer',
        border: seen ? '1.5px solid transparent' : `1.5px solid ${cfg.border}`,
        background: seen ? '#fff' : cfg.bg,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      
      {!seen && (
        <Box
          sx={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 5,
            borderRadius: '12px 0 0 12px',
            background: cfg.color,
          }}
        />
      )}

      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="flex-start" gap={1.5}>
         
          <Box
            sx={{
              mt: 0.3,
              width: 36, height: 36,
              borderRadius: '50%',
              background: cfg.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <Icon sx={{ fontSize: 18, color: cfg.color }} />
          </Box>

          
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.3}>
              <Chip
                label={cfg.label}
                size="small"
                sx={{
                  background: cfg.bg,
                  color: cfg.color,
                  border: `1px solid ${cfg.border}`,
                  height: 20,
                }}
              />
              {!seen && (
                <Chip
                  icon={<FiberNewIcon sx={{ fontSize: '14px !important' }} />}
                  label="New"
                  size="small"
                  sx={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    border: '1px solid #a5d6a7',
                    height: 20,
                    '& .MuiChip-icon': { color: '#2e7d32' },
                  }}
                />
              )}
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: seen ? 400 : 700,
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#1a1a2e',
                wordBreak: 'break-word',
              }}
            >
              {notification.message}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.3}>
              {formatTimestamp(notification.timestamp)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
