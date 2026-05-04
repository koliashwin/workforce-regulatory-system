import { Chip } from '@mui/material';

// Maps raw status strings from backend → visual chip config
const statusMap = {
  // Employment statuses
  'joined safely':   { label: 'Joined',       color: 'success' },
  'joined company':  { label: 'Joined',       color: 'success' },
  'safe exit':       { label: 'Safe Exit',    color: 'info' },
  'pending exit':    { label: 'Pending Exit', color: 'warning' },

  // Dispute statuses
  'pending':         { label: 'Pending',      color: 'warning' },
  'resolved':        { label: 'Resolved',     color: 'success' },
  'rejected':        { label: 'Rejected',     color: 'error' },
  'under review':    { label: 'Under Review', color: 'info' },

  // Verification statuses
  'registered':      { label: 'Verified',     color: 'success' },
  'unknown':         { label: 'Unverified',   color: 'default' },
  'suspended':       { label: 'Suspended',    color: 'error' },
};

const StatusChip = ({ value }) => {
  const key   = (value || '').toLowerCase();
  const cfg   = statusMap[key] || { label: value || '—', color: 'default' };

  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      variant="filled"
      sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.03em' }}
    />
  );
};

export default StatusChip;
