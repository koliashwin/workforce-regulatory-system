import { Box, Typography } from '@mui/material';
import { tokens } from '../theme/theme';

/**
 * StatCard - compact KPI tile for dashboards
 * Props: label, value, icon (MUI SvgIcon), accent (CSS color), sub (secondary text)
 */
const StatCard = ({ label, value, icon: Icon, accent, sub }) => (
  <Box
    sx={{
      background: '#fff',
      border: `1px solid ${tokens.slate[100]}`,
      borderRadius: '12px',
      p: '18px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      position: 'relative',
      overflow: 'hidden',
      '&::before': accent ? {
        content: '""',
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        background: accent,
        borderRadius: '3px 0 0 3px',
      } : {},
    }}
  >
    {Icon && (
      <Box
        sx={{
          width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
          background: accent ? `${accent}18` : tokens.slate[50],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 18, color: accent || tokens.slate[300] }} />
      </Box>
    )}
    <Box>
      <Typography
        sx={{ fontFamily: '"DM Mono", monospace', fontSize: '1.625rem', fontWeight: 500, lineHeight: 1.1, color: tokens.navy[800] }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300], mt: 0.25, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: '0.75rem', color: tokens.teal[600], mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </Box>
  </Box>
);

export default StatCard;
