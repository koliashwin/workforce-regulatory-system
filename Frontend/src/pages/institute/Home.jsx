import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import instituteAPI from '../../api/modules/instituteAPI';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import DisputeCard from '../../components/DisputeCard';
import { tokens } from '../../theme/theme';

import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkIcon from '@mui/icons-material/WorkOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const studentCols = [
    { label: 'Name', key: 'student_name' },
    { label: 'Course', key: 'course' },
    { label: 'Passout', key: 'passout_year', mono: true },
    { label: 'Employer', key: 'company_name', render: r => r.company_name || '—' },
    { label: 'Designation', key: 'designation', render: r => r.designation || '—' },
];

const InstituteHome = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        instituteAPI.instituteProfile()
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

    const info = profile?.institute_info || {};
    const students = profile?.institute_students || [];
    const disputes = profile?.dispute_history || [];
    const employed = students.filter(s => s.company_name).length;
    const pendingD = disputes.filter(d => d.status === 'pending').length;
    const isVerified = info.verification_status?.toLowerCase() === 'registered';

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3">{info.name || 'Institute Dashboard'}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                    {info.address} &nbsp;·&nbsp;
                    <span style={{ color: isVerified ? tokens.green[600] : tokens.amber[600], fontWeight: 600 }}>
                        {isVerified ? '✓ Verified' : '⚠ Unverified'}
                    </span>
                </Typography>
            </Box>

            {/* KPI row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <StatCard label="Total Alumni" value={students.length} icon={PeopleIcon} accent={tokens.teal[500]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Employed" value={employed} icon={WorkIcon} accent={tokens.green[600]}
                        sub={`${students.length ? Math.round(employed / students.length * 100) : 0}% placement rate`} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Seeking Work" value={students.length - employed} icon={PersonAddIcon} accent={tokens.navy[600]} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard label="Open Disputes" value={pendingD} icon={GavelIcon}
                        accent={pendingD > 0 ? tokens.amber[500] : tokens.slate[200]} />
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Alumni & Placements</Typography>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/institute/candidates')}>
                                    Full List
                                </Button>
                            </Box>
                            <DataTable data={students} columns={studentCols} maxRows={6}
                                emptyText="No students enrolled yet." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Quick Actions</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button fullWidth variant="outlined" startIcon={<PersonAddIcon />} onClick={() => navigate('/institute/onboard')}>
                                    Enroll New Student
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<PeopleIcon />} onClick={() => navigate('/institute/candidates')}>
                                    View All Alumni
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

export default InstituteHome;
