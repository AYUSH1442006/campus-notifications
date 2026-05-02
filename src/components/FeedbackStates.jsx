

import React from 'react';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export function LoadingState({ message = 'Fetching notifications…' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      gap={2}
    >
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Box py={4}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )
        }
      >
        {message ?? 'Something went wrong. Please try again.'}
      </Alert>
    </Box>
  );
}

export function EmptyState({ message = 'No notifications found.' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={8}
      gap={1}
    >
      <Typography variant="h2" sx={{ opacity: 0.2 }}>🔔</Typography>
      <Typography variant="body1" color="text.secondary">{message}</Typography>
    </Box>
  );
}
