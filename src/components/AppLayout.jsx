
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, useMediaQuery, Divider, Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import logger from '../logging_middleware/logger';

const NAV_ITEMS = [
  { label: 'All Notifications', path: '/', Icon: NotificationsIcon },
  { label: 'Priority Notifications', path: '/priority', Icon: StarIcon },
];

export default function AppLayout({ children, unseenCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path) => {
    logger.action('NAVIGATE', { to: path });
    navigate(path);
    setDrawerOpen(false);
  };

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box p={2} display="flex" alignItems="center" gap={1}>
        <SchoolIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={800} color="primary.main">
          Campus Notify
        </Typography>
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map(({ label, path, Icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => handleNav(path)}
              sx={{
                '&.Mui-selected': {
                  background: '#e8eaf6',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f2f5' }}>
      
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <SchoolIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ flexGrow: 1, letterSpacing: '-0.3px' }}
          >
            Campus Notify
          </Typography>

         
          {!isMobile && (
            <Box display="flex" gap={1}>
              {NAV_ITEMS.map(({ label, path, Icon }) => (
                <Button
                  key={path}
                  color="inherit"
                  startIcon={
                    path === '/' ? (
                      <Badge badgeContent={unseenCount} color="secondary" max={99}>
                        <Icon />
                      </Badge>
                    ) : (
                      <Icon />
                    )
                  }
                  onClick={() => handleNav(path)}
                  sx={{
                    fontWeight: location.pathname === path ? 800 : 500,
                    background:
                      location.pathname === path
                        ? 'rgba(255,255,255,0.15)'
                        : 'transparent',
                    borderRadius: 2,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          
          {isMobile && unseenCount > 0 && (
            <Badge badgeContent={unseenCount} color="secondary" max={99}>
              <NotificationsIcon />
            </Badge>
          )}
        </Toolbar>
      </AppBar>

     
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>

   
      <Box component="main" sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
