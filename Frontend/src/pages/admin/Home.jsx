import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, Grid, Skeleton, Typography, Button } from '@mui/material';
import adminAPI from '../../api/modules/adminAPI';
import candidateAPI from '../../api/modules/candidateAPI';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import DisputeCard from '../../components/DisputeCard';
import SectionHeader from '../../components/SectionHeader';
import { tokens } from '../../theme/theme';

import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const companyCols = [
    { label: 'Company', key: 'name' },
    { label: 'CIN', key: 'cin', mono: true },
    { label: 'Email', key: 'email' },
    { label: 'Status', key: 'verification_status', isStatus: true },
];
const candidateCols = [
    { label: 'Name', key: 'user_name' },
    { label: 'Email', key: 'user_email' },
    { label: 'Course', key: 'course' },
    { label: 'Passout', key: 'passout_year', mono: true },
];
const instituteCols = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Contact', key: 'contact_no' },
    { label: 'Status', key: 'verification_status', isStatus: true },
];

const STATUS_FILTERS = ['All', 'pending', 'under review', 'resolved', 'rejected'];

const AdminHome = () => {
    const [companies, setCompanies] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [disputes, setDisputes] = useState([]);
    const [dispFilter, setDispFilter] = useState('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            adminAPI.allCompanyList().catch(() => ({ data: [] })),
            adminAPI.allCandidateList().catch(() => ({ data: [] })),
            adminAPI.allInstituteList().catch(() => ({ data: [] })),
            adminAPI.disputeList().catch(() => ({ data: [] })),
        ]).then(([comp, cand, inst, disp]) => {
            setCompanies(comp.data || []);
            setCandidates(cand.data || []);
            setInstitutes(inst.data || []);
            setDisputes(disp.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const handleDisputeAction = async (dispute, action) => {
        const statusMap = {
            resolve: 'resolved',
            reject: 'rejected',
            review: 'under review'
        };
        try {
            await adminAPI.updateDispute(dispute.dispute_id, statusMap[action]);
            // Refresh disputes list
            setDisputes(prev => prev.map(d =>
                d.dispute_id === dispute.dispute_id
                    ? { ...d, status: statusMap[action] }
                    : d
            ));
        } catch (err) {
            alert('Failed to update dispute status');
        }
    };

    const filteredDisputes = dispFilter === 'All'
        ? disputes
        : disputes.filter(d => d.status?.toLowerCase() === dispFilter);

    const pendingCount = disputes.filter(d => d.status === 'pending').length;

    if (loading) return (
        <Box>
            <Skeleton variant="text" width={240} height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={88} /></Grid>)}
            </Grid>
        </Box>
    );

    return (
        <Box>
            <SectionHeader title="Admin Overview" sub="Platform-wide statistics and dispute management" Icon={AdminPanelSettingsIcon} />

            {pendingCount > 0 && (
                <Alert severity="warning" sx={{ mb: 2.5 }}>
                    {pendingCount} disputes are pending resolution. Review them below.
                </Alert>
            )}

            {/* KPIs */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <StatCard label="Companies" value={companies.length} icon={BusinessIcon} accent={tokens.teal[500]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Institutes" value={institutes.length} icon={SchoolIcon} accent={tokens.navy[600]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Candidates" value={candidates.length} icon={PeopleIcon} accent={tokens.teal[700]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Open Disputes" value={pendingCount} icon={GavelIcon} accent={pendingCount > 0 ? tokens.red[600] : tokens.slate[200]} />
                </Grid>
            </Grid>

            {/* ── Dispute Management ─────────────────────────── */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Dispute Management</Typography>
                        <Typography variant="caption">{disputes.length} total disputes</Typography>
                    </Box>

                    {/* Filter chips */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {STATUS_FILTERS.map(s => {
                            const count = s === 'All' ? disputes.length : disputes.filter(d => d.status?.toLowerCase() === s).length;
                            return (
                                <Chip key={s} size="small" label={`${s[0].toUpperCase() + s.slice(1)} (${count})`}
                                    onClick={() => setDispFilter(s)}
                                    variant={dispFilter === s ? 'filled' : 'outlined'}
                                    color={s === 'pending' ? 'warning' : s === 'resolved' ? 'success' : s === 'rejected' ? 'error' : s === 'under review' ? 'info' : 'default'}
                                    sx={{ borderRadius: '6px', fontWeight: 600 }} />
                            );
                        })}
                    </Box>

                    {filteredDisputes.length === 0
                        ? <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                            No disputes with this status.
                        </Typography>
                        : filteredDisputes.map(d => (
                            <DisputeCard key={d.dispute_id} dispute={d} onAction={handleDisputeAction} />
                        ))
                    }
                </CardContent>
            </Card>

            {/* ── Entity tables ────────────────────────────────── */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Companies</Typography>
                            <DataTable data={companies} columns={companyCols} maxRows={5} emptyText="No companies registered." />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Institutes</Typography>
                            <DataTable data={institutes} columns={instituteCols} maxRows={5} emptyText="No institutes registered." />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Candidates</Typography>
                            <DataTable data={candidates} columns={candidateCols} maxRows={8} emptyText="No candidates registered." />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminHome;
