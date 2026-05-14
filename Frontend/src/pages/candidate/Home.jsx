import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Alert, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import candidateAPI from '../../api/modules/candidateAPI';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import SectionHeader from '../../components/SectionHeader';
import DisputeCard from '../../components/DisputeCard';
import { tokens } from '../../theme/theme';

// MUI Icons
import WorkIcon from '@mui/icons-material/WorkOutline';
import SchoolIcon from '@mui/icons-material/School';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const employmentCols = [
    { label: 'Company', key: 'name' },
    { label: 'CIN', key: 'cin', mono: true },
    { label: 'Joined', key: 'joining_date', mono: true },
    { label: 'Exit', key: 'exit_date', render: r => r.exit_date || '—', mono: true },
    { label: 'Status', key: 'status', isStatus: true },
];

const CandidateHome = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        candidateAPI.getProfile()
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box>
            <Skeleton variant="text" width={240} height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={88} /></Grid>)}
            </Grid>
        </Box>
    );

    const emp = profile?.employment_history || [];
    const disputes = profile?.dispute_history || [];
    const academic = profile?.acdemic_info?.[0] || {};
    const personal = profile?.personal_info || {};
    const activeJob = emp.find(e => e.status === 'joining completed' || e.status === 'exit initiated');
    const pendingDisp = disputes.filter(d => d.status === 'pending').length;

    return (
        <Box>
            {/* Welcome header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3">Welcome back, {personal.name?.split(' ')[0] || 'Candidate'}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                    Your verified employment & education record
                </Typography>
            </Box>

            {/* Pending action alerts */}
            {pendingDisp > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }} action={
                    <Button size="small" onClick={() => navigate('/candidate/disputes')}>View Disputes</Button>
                }>
                    You have {pendingDisp} pending dispute{pendingDisp > 1 ? 's' : ''} that need attention.
                </Alert>
            )}

            {!activeJob && emp.length > 0 && (
                <Alert severity="info" sx={{ mb: 2 }} action={
                    <Button size="small" onClick={() => navigate('/candidate/joining_confirm')}>Confirm Now</Button>
                }>
                    Have you recently joined a company? Confirm your joining date to keep your record up to date.
                </Alert>
            )}

            {/* KPI row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <StatCard label="Employers" value={emp.length} icon={WorkIcon} accent={tokens.teal[500]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Current Status" value={activeJob ? 'Employed' : 'Unassigned'} icon={CheckCircleOutlineIcon}
                        accent={activeJob ? tokens.green[600] : tokens.slate[300]}
                        sub={activeJob ? activeJob.name : 'No active employer'} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Education" value={academic.course || '—'} icon={SchoolIcon} accent={tokens.navy[800]}
                        sub={academic.institute_name} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Open Disputes" value={pendingDisp} icon={GavelIcon}
                        accent={pendingDisp > 0 ? tokens.amber[500] : tokens.slate[200]} />
                </Grid>
            </Grid>

            {/* Employment timeline + Quick actions */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Employment History</Typography>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/candidate/profile')}>Full Profile</Button>
                            </Box>
                            <DataTable
                                data={emp}
                                columns={employmentCols}
                                maxRows={5}
                                emptyText="No employment records yet. Your history will appear here after a company onboards you."
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    {/* Quick actions */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Quick Actions</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button fullWidth variant="outlined" startIcon={<CheckCircleOutlineIcon />}
                                    onClick={() => navigate('/candidate/joining_confirm')}>
                                    Confirm Joining Date
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate('/candidate/exit_confirm')}>
                                    Confirm Exit Date
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<GavelIcon />}
                                    onClick={() => navigate('/candidate/disputes')}>
                                    View All Disputes
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Recent disputes */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Recent Disputes</Typography>
                            {disputes.length === 0
                                ? <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>No disputes. Clean record!</Typography>
                                : disputes.slice(0, 2).map(d => <DisputeCard key={d.dispute_id} dispute={d} />)
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CandidateHome;
