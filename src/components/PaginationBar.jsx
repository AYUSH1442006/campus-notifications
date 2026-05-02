

import React from 'react';
import {
  Box, Pagination, Select, MenuItem, Typography, FormControl, InputLabel,
} from '@mui/material';
import logger from '../logging_middleware/logger';

export default function PaginationBar({ page, totalPages, limit, onPageChange, onLimitChange, total }) {
  const handlePage = (_, value) => {
    logger.action('PAGE_CHANGED', { page: value });
    onPageChange(value);
  };

  const handleLimit = (e) => {
    logger.action('LIMIT_CHANGED', { limit: e.target.value });
    onLimitChange(Number(e.target.value));
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      mt={2}
    >
      <Typography variant="body2" color="text.secondary">
        {total} notification{total !== 1 ? 's' : ''}
      </Typography>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePage}
        color="primary"
        shape="rounded"
        size="small"
      />

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Per page</InputLabel>
        <Select value={limit} label="Per page" onChange={handleLimit}>
          {[5, 10, 15, 20, 25].map((n) => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
