
import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './utils/theme';
import AppLayout from './components/AppLayout';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityNotificationsPage from './pages/PriorityNotificationsPage';

import { useNotifications } from './hooks/useNotifications';
import { getSeenIds } from './utils/notificationUtils';

// Inner component so we can use the hook after provider setup
function AppRoutes() {
  const { notifications } = useNotifications();
  const unseenCount = useMemo(() => {
    const seen = getSeenIds();
    return notifications.filter((n) => !seen.has(String(n.id))).length;
  }, [notifications]);

  return (
    <AppLayout unseenCount={unseenCount}>
      <Routes>
        <Route path="/" element={<AllNotificationsPage />} />
        <Route path="/priority" element={<PriorityNotificationsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
