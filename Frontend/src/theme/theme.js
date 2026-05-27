import { createTheme } from '@mui/material/styles';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Workforce Regulatory System - "Trust Infrastructure" aesthetic
// Dark navy authority with amber accent. Feels like a government-grade tool
// that a startup actually wants to use. No purple gradients.

export const tokens = {
  navy:    { 950: '#07090f', 900: '#0d1117', 800: '#161b26', 700: '#1e2636', 600: '#263142', 500: '#2e3d52' },
  slate:   { 400: '#4a5568', 300: '#718096', 200: '#a0aec0', 100: '#e2e8f0', 50: '#f7f9fc' },
  amber:   { 600: '#b45309', 500: '#d97706', 400: '#f59e0b', 300: '#fbbf24', 100: '#fef3c7', 50: '#fffbeb' },
  teal:    { 700: '#0f766e', 600: '#0d9488', 500: '#14b8a6', 100: '#ccfbf1', 50: '#f0fdfa' },
  red:     { 700: '#b91c1c', 600: '#dc2626', 100: '#fee2e2', 50: '#fef2f2' },
  green:   { 700: '#15803d', 600: '#16a34a', 100: '#dcfce7', 50: '#f0fdf4' },
  white:   '#ffffff',
  ink:     '#0d1117',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: tokens.navy[800], light: tokens.navy[600], dark: tokens.navy[950], contrastText: '#fff' },
    secondary: { main: tokens.amber[500], light: tokens.amber[300], dark: tokens.amber[600], contrastText: tokens.navy[900] },
    success:   { main: tokens.green[600], light: tokens.green[100], dark: tokens.green[700] },
    error:     { main: tokens.red[600],   light: tokens.red[100],   dark: tokens.red[700] },
    info:      { main: tokens.teal[600],  light: tokens.teal[100],  dark: tokens.teal[700] },
    background: { default: tokens.slate[50], paper: tokens.white },
    text: { primary: tokens.navy[800], secondary: tokens.slate[400], disabled: tokens.slate[200] },
    divider: tokens.slate[100],
  },

  typography: {
    fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', color: tokens.navy[800] },
    h2: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600, fontSize: '1.5rem',   letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, fontSize: '1.125rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500, fontSize: '0.9375rem', color: tokens.slate[400] },
    subtitle2: { fontWeight: 500, fontSize: '0.8125rem', color: tokens.slate[300] },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace' },
    overline: { fontFamily: '"DM Mono", monospace', fontSize: '0.6875rem', letterSpacing: '0.1em', color: tokens.slate[300] },
  },

  shape: { borderRadius: 10 },

  shadows: [
    'none',
    '0 1px 3px rgba(13,17,23,0.06), 0 1px 2px rgba(13,17,23,0.04)',
    '0 4px 6px rgba(13,17,23,0.06), 0 2px 4px rgba(13,17,23,0.04)',
    '0 10px 15px rgba(13,17,23,0.08), 0 4px 6px rgba(13,17,23,0.04)',
    '0 20px 25px rgba(13,17,23,0.1), 0 10px 10px rgba(13,17,23,0.04)',
    ...Array(20).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { background-color: ${tokens.slate[50]}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${tokens.slate[200]}; border-radius: 3px; }
      `,
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.slate[100]}`,
          borderRadius: 12,
          background: tokens.white,
          transition: 'box-shadow 0.2s ease',
        },
      },
    },

    MuiCardContent: {
      styleOverrides: { root: { padding: '20px 24px', '&:last-child': { paddingBottom: 20 } } },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 8, padding: '8px 18px', fontSize: '0.875rem' },
        contained: { '&:hover': { filter: 'brightness(1.08)' } },
        outlined: { borderColor: tokens.slate[100], color: tokens.navy[800], '&:hover': { borderColor: tokens.slate[200], background: tokens.slate[50] } },
        text: { color: tokens.teal[600], '&:hover': { background: tokens.teal[50] } },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: tokens.slate[100] },
            '&:hover fieldset': { borderColor: tokens.slate[200] },
            '&.Mui-focused fieldset': { borderColor: tokens.teal[500], borderWidth: 1.5 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: tokens.teal[600] },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-head': { background: tokens.slate[50], fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: tokens.slate[300], padding: '10px 16px', fontFamily: '"DM Mono", monospace' } },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { padding: '12px 16px', borderColor: tokens.slate[100], fontSize: '0.875rem' },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { background: tokens.slate[50] }, '&:last-child td': { border: 0 } },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: '0.75rem', borderRadius: 6, height: 24 },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { background: tokens.navy[900], border: 'none', borderRight: `1px solid ${tokens.navy[700]}` },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: { background: tokens.navy[950], borderBottom: `1px solid ${tokens.navy[700]}`, boxShadow: 'none' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, margin: '2px 8px', padding: '8px 12px',
          color: tokens.slate[200],
          '&:hover': { background: tokens.navy[700], color: tokens.white },
          '&.Mui-selected': { background: `${tokens.amber[500]}18`, color: tokens.amber[300], '&:hover': { background: `${tokens.amber[500]}28` } },
        },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: tokens.slate[100] } },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.875rem' },
        standardSuccess: { background: tokens.green[50], color: tokens.green[700] },
        standardError:   { background: tokens.red[50],   color: tokens.red[700] },
        standardInfo:    { background: tokens.teal[50],  color: tokens.teal[700] },
        standardWarning: { background: tokens.amber[50], color: tokens.amber[600] },
      },
    },
  },
});

export default theme;
