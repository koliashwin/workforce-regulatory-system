import { Chip } from '@mui/material';

// Maps raw status strings from backend → visual chip config
const statusMap = {
    // Employment statuses
    'joining initiated': { label: 'Joining Initiated', color: 'info' },
    'joining confirmed': { label: 'Date Confirmed', color: 'info' },
    'joining completed': { label: 'Joined', color: 'success' },
    'joining date mismatch': { label: 'Date Mismatch', color: 'error' },
    'joining documents incomplete': { label: 'Docs Incomplete', color: 'warning' },
    'exit initiated': { label: 'Exit Initiated', color: 'warning' },
    'exit confirmed': { label: 'Exit Date Confirmed', color: 'warning' },
    'exit completed': { label: 'Exited', color: 'default' },
    'exit date mismatch': { label: 'Exit Date Mismatch', color: 'error' },
    'exit documents incomplete': { label: 'Exit Docs Incomplete', color: 'error' },

    // Dispute statuses
    'pending': { label: 'Pending', color: 'warning' },
    'resolved': { label: 'Resolved', color: 'success' },
    'rejected': { label: 'Rejected', color: 'error' },
    'under review': { label: 'Under Review', color: 'info' },

    // Verification statuses
    'registered': { label: 'Verified', color: 'success' },
    'unknown': { label: 'Unverified', color: 'default' },
    'suspended': { label: 'Suspended', color: 'error' },
};

const StatusChip = ({ value }) => {
    const key = (value || '').toLowerCase();
    const cfg = statusMap[key] || { label: value || '—', color: 'default' };

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
