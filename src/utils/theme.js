import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',       // Deep indigo
      light: '#534bae',
      dark: '#000051',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00bfa5',       // Teal accent
      light: '#5df2d6',
      dark: '#008e76',
      contrastText: '#fff',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    // Custom colors for notification types
    placement: { main: '#7c4dff', light: '#f3efff', dark: '#4a148c' },
    result:    { main: '#f57c00', light: '#fff3e0', dark: '#bf360c' },
    event:     { main: '#0288d1', light: '#e1f5fe', dark: '#01579b' },
    unseen:    { main: '#fff8e1', border: '#ffe082' },
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    body2: { fontSize: '0.82rem' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 700 },
      },
    },
  },
});

export default theme;
