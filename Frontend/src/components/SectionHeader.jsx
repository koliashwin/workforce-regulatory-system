import { Box, Button, Typography } from '@mui/material';
import { tokens } from '../theme/theme';

/**
 * SectionHeader — consistent page/section heading
 * Props: title, sub, action (text), onAction, icon (MUI SvgIcon)
 */
const SectionHeader = ({ title, sub, action, onAction, Icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {Icon && (
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: tokens.navy[800], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon sx={{ fontSize: 20, color: tokens.amber[400] }} />
        </Box>
      )}
      <Box>
        <Typography variant="h3" sx={{ lineHeight: 1.2 }}>{title}</Typography>
        {sub && <Typography variant="subtitle1" sx={{ mt: 0.25 }}>{sub}</Typography>}
      </Box>
    </Box>
    {action && (
      <Button variant="contained" size="small" onClick={onAction} sx={{ mt: 0.5 }}>
        {action}
      </Button>
    )}
  </Box>
);

export default SectionHeader;
