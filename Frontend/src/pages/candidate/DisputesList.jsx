import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import candidateAPI from '../../api/modules/candidateAPI';
import DisputeCard from '../../components/DisputeCard';
import SectionHeader from '../../components/SectionHeader';
import { tokens } from '../../theme/theme';

import GavelIcon from '@mui/icons-material/Gavel';

const STATUS_FILTERS = ['All', 'pending', 'under review', 'resolved', 'rejected'];

const DisputesList = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        candidateAPI.disputeList()
            .then(res => setDisputes(res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'All'
        ? disputes
        : disputes.filter(d => d.status?.toLowerCase() === filter);

    const counts = STATUS_FILTERS.slice(1).reduce((acc, s) => {
        acc[s] = disputes.filter(d => d.status?.toLowerCase() === s).length;
        return acc;
    }, {});

    return (
        <Box>
            <SectionHeader
                title="Disputes"
                sub="All disputes raised by or against you — auto-generated on date mismatches"
                Icon={GavelIcon}
            />

            {/* Summary chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
                <Chip label={`All (${disputes.length})`} onClick={() => setFilter('All')}
                    variant={filter === 'All' ? 'filled' : 'outlined'}
                    sx={{ borderRadius: '6px', fontWeight: 600, background: filter === 'All' ? tokens.navy[800] : 'transparent', color: filter === 'All' ? '#fff' : 'inherit' }} />
                {Object.entries(counts).map(([status, count]) => (
                    <Chip key={status} label={`${status[0].toUpperCase() + status.slice(1)} (${count})`}
                        onClick={() => setFilter(status)}
                        variant={filter === status ? 'filled' : 'outlined'}
                        color={status === 'pending' ? 'warning' : status === 'resolved' ? 'success' : status === 'rejected' ? 'error' : 'info'}
                        sx={{ borderRadius: '6px', fontWeight: 600, opacity: count === 0 ? 0.4 : 1 }} />
                ))}
            </Box>

            {/* Explanation card for empty state */}
            {!loading && disputes.length === 0 && (
                <Card sx={{ borderLeft: `3px solid ${tokens.green[600]}`, borderRadius: '0 12px 12px 0' }}>
                    <CardContent>
                        <Typography variant="h6" color="success.main" sx={{ mb: 0.5 }}>Clean Record</Typography>
                        <Typography variant="body2" color="text.secondary">
                            No disputes have been raised involving your account. Disputes are automatically generated when a company and candidate submit mismatching joining or exit dates. Keep confirming your dates promptly to avoid any.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* How disputes work — shown when there are disputes */}
            {disputes.length > 0 && (
                <Card sx={{ mb: 2.5, background: tokens.slate[50], border: `1px solid ${tokens.slate[100]}` }}>
                    <CardContent sx={{ py: '14px !important' }}>
                        <Typography variant="overline" sx={{ mb: 1, display: 'block' }}>How disputes work</Typography>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {[
                                ['Auto-generated', 'When joining or exit dates submitted by company and candidate do not match, a dispute is instantly created.'],
                                ['Traceable', 'Each dispute records who raised it, against whom, and on what date — timestamped and immutable.'],
                                ['Resolvable', 'Disputes are resolved by an admin after reviewing both parties\' submissions.'],
                            ].map(([title, desc]) => (
                                <Box key={title} sx={{ flex: '1 1 180px', minWidth: 160 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', mb: 0.25 }}>{title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{desc}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Disputes list */}
            {loading
                ? [1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={90} sx={{ mb: 1.5 }} />)
                : filtered.length === 0
                    ? <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No disputes with status "{filter}".
                    </Typography>
                    : filtered.map(d => <DisputeCard key={d.dispute_id} dispute={d} />)
            }
        </Box>
    );
};

export default DisputesList;
