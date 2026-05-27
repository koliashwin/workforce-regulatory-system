import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import companyAPI from '../../api/modules/companyAPI';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import DisputeCard from '../../components/DisputeCard';
import { tokens } from '../../theme/theme';

import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const employeeCols = [
    { label: 'Name', key: 'employee_name' },
    { label: 'Designation', key: 'designation' },
    { label: 'Joined', key: 'joining_date', mono: true },
    { label: 'Exit', key: 'exit_date', render: r => r.exit_date || 'Present', mono: true },
    { label: 'Status', key: 'employee_status', isStatus: true },
];

const CompanyHome = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        companyAPI.companyProfile()
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box>
            <Skeleton variant="text" width={280} height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={88} /></Grid>)}
            </Grid>
        </Box>
    );

    const info = profile?.company_info || {};
    const employees = profile?.company_employees || [];
    const disputes = profile?.dispute_history || [];
    const active = employees.filter(e => !e.exit_date).length;
    const pendingD = disputes.filter(d => d.status === 'pending').length;
    const isVerified = info.verification_status?.toLowerCase() === 'registered';

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3">{info.name || 'Company Dashboard'}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                    CIN: <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.8rem' }}>{info.cin || '-'}</span>
                    &nbsp;·&nbsp;
                    <span style={{ color: isVerified ? tokens.green[600] : tokens.amber[600], fontWeight: 600 }}>
                        {isVerified ? '✓ Verified' : '⚠ Unverified'}
                    </span>
                </Typography>
            </Box>

            {/* Alerts */}
            {!isVerified && (
                <Alert severity="warning" sx={{ mb: 2 }} action={
                    <Button size="small" onClick={() => navigate('/company/verify')}>Verify Now</Button>
                }>
                    Your company is not verified.
                </Alert>
            )}
            {pendingD > 0 && (
                <Alert severity="error" sx={{ mb: 2 }} icon={<WarningAmberIcon />}>
                    {pendingD} active dispute{pendingD > 1 ? 's' : ''} require your attention.
                </Alert>
            )}

            {/* KPI row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <StatCard label="Total Hires" value={employees.length} icon={PeopleIcon} accent={tokens.teal[500]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Currently Active" value={active} icon={PersonAddIcon} accent={tokens.green[600]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Verification" value={isVerified ? 'Verified' : 'Pending'} icon={VerifiedIcon}
                        accent={isVerified ? tokens.green[600] : tokens.amber[500]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Open Disputes" value={pendingD} icon={GavelIcon}
                        accent={pendingD > 0 ? tokens.red[600] : tokens.slate[200]} />
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                {/* Employee list */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Employee Register</Typography>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/company/employees')}>All Employees</Button>
                            </Box>
                            <DataTable data={employees} columns={employeeCols} maxRows={5}
                                emptyText="No employees onboarded yet." />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right column */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Quick Actions</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button fullWidth variant="outlined" startIcon={<PersonAddIcon />} onClick={() => navigate('/company/onboard')}>
                                    Onboard Employee
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<ArrowForwardIcon />} onClick={() => navigate('/company/employee_exit')}>
                                    Record Exit
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<VerifiedIcon />} onClick={() => navigate('/company/verify')}>
                                    Verify Company
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Disputes</Typography>
                            {disputes.length === 0
                                ? <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>No disputes on record.</Typography>
                                : disputes.slice(0, 3).map(d => <DisputeCard key={d.dispute_id} dispute={d} />)
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CompanyHome;
