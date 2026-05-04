import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StatusChip from './StatusChip';
import { tokens } from '../theme/theme';

const entityIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'candidate': return <PersonIcon sx={{ fontSize: 14 }} />;
    case 'company':   return <BusinessIcon sx={{ fontSize: 14 }} />;
    case 'institute': return <SchoolIcon sx={{ fontSize: 14 }} />;
    default: return null;
  }
};

const accentByStatus = {
  pending:      tokens.amber[500],
  'under review': tokens.teal[500],
  resolved:     tokens.green[600],
  rejected:     tokens.red[600],
};

/**
 * DisputeCard — rich card for a single dispute record
 * Props: dispute (object), onAction (optional callback)
 */
const DisputeCard = ({ dispute, onAction }) => {
  const status  = (dispute.status || '').toLowerCase();
  const accent  = accentByStatus[status] || tokens.slate[200];
  const created = dispute.created_on ? new Date(dispute.created_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${tokens.slate[100]}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: '0 12px 12px 0',
        p: '16px 20px',
        mb: 1.5,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px rgba(13,17,23,0.08)' },
      }}
    >
      {/* Top row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: accent, mt: '1px', flexShrink: 0 }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: tokens.navy[800] }}>
            {dispute.topic || 'Dispute'}
          </Typography>
        </Box>
        <StatusChip value={dispute.status} />
      </Box>

      {/* Description */}
      {dispute.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, ml: '24px' }}>
          {dispute.description}
        </Typography>
      )}

      {/* Parties + meta */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: '24px', mb: onAction ? 1.5 : 0 }}>
        <Chip
          icon={entityIcon(dispute.raised_by_type)}
          label={`Raised by: ${dispute.raised_by_type} #${dispute.raised_by_id}`}
          size="small"
          sx={{ background: tokens.slate[50], color: tokens.slate[400], fontSize: '0.72rem' }}
        />
        <Chip
          icon={entityIcon(dispute.raised_against_type)}
          label={`Against: ${dispute.raised_against_type} #${dispute.raised_against_id}`}
          size="small"
          sx={{ background: tokens.slate[50], color: tokens.slate[400], fontSize: '0.72rem' }}
        />
        <Chip
          icon={<AccessTimeIcon sx={{ fontSize: '12px !important' }} />}
          label={created}
          size="small"
          sx={{ background: 'transparent', color: tokens.slate[300], fontSize: '0.72rem', fontFamily: '"DM Mono", monospace' }}
        />
      </Box>

      {/* Action row for admin/resolution */}
      {onAction && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => onAction(dispute, 'review')}>Mark Under Review</Button>
            <Button size="small" variant="contained" color="success" onClick={() => onAction(dispute, 'resolve')}>Resolve</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onAction(dispute, 'reject')}>Reject</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DisputeCard;
