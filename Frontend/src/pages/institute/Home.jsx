import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import instituteAPI from '../../api/modules/instituteAPI';
import { tokens } from '../../theme/theme';

import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkIcon from '@mui/icons-material/WorkOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

const StudentRow = ({ student }) => {
    const isEmployed = !!student.company_name;
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2, py: 1.5,
            borderBottom: `1px solid ${tokens.slate[100]}`,
            '&:last-child': { borderBottom: 'none' }
        }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: `${tokens.navy[600]}22`, color: tokens.navy[700], fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                {getInitials(student.student_name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: tokens.navy[800], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.student_name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>
                    {student.course} · {student.passout_year}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                {isEmployed ? (
                    <>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: tokens.green[600] }}>{student.company_name}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300] }}>{student.designation}</Typography>
                    </>
                ) : (
                    <Chip label="Seeking" size="small" sx={{ bgcolor: tokens.amber[100], color: tokens.amber[600], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                )}
            </Box>
        </Box>
    );
};

const DisputeRow = ({ dispute }) => {
    const isPending = dispute.status === 'pending';
    return (
        <Box sx={{
            p: 1.5, borderRadius: 2, mb: 1,
            bgcolor: isPending ? tokens.red[50] : tokens.slate[50],
            border: `1px solid ${isPending ? tokens.red[100] : tokens.slate[100]}`,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: tokens.navy[800] }}>{dispute.topic}</Typography>
                <Chip label={dispute.status} size="small"
                    sx={{ bgcolor: isPending ? tokens.red[100] : tokens.slate[100], color: isPending ? tokens.red[700] : tokens.slate[400], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300], mt: 0.25 }}>
                {dispute.raised_by_type} → {dispute.raised_against_type}
            </Typography>
        </Box>
    );
};

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
        <Box sx={{ p: 1 }}>
            <Skeleton variant="text" width={320} height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={28} sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={100} /></Grid>)}
            </Grid>
        </Box>
    );

    const info = profile?.institute_info || {};
    const students = profile?.institute_students || [];
    const disputes = profile?.dispute_history || [];
    const employed = students.filter(s => s.company_name).length;
    const seeking = students.length - employed;
    const pendingD = disputes.filter(d => d.status === 'pending').length;
    const isVerified = info.verification_status?.toLowerCase() === 'registered';
    const placementRate = students.length ? Math.round((employed / students.length) * 100) : 0;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: tokens.navy[800], fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(info.name)}
                </Avatar>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Typography variant="h3">{info.name || 'Institute Dashboard'}</Typography>
                        <Chip
                            icon={isVerified ? <VerifiedIcon sx={{ fontSize: '14px !important' }} /> : <WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                            label={isVerified ? 'Verified' : 'Unverified'} size="small"
                            sx={{ bgcolor: isVerified ? tokens.green[100] : tokens.amber[100], color: isVerified ? tokens.green[700] : tokens.amber[600], fontWeight: 600, fontSize: '0.75rem' }}
                        />
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', color: tokens.slate[300], mt: 0.25 }}>
                        {info.address || '—'}
                    </Typography>
                </Box>
            </Box>

            {pendingD > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {pendingD} active dispute{pendingD > 1 ? 's' : ''} require your attention.
                </Alert>
            )}

            {/* KPI Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Alumni', value: students.length, icon: SchoolIcon, accent: tokens.teal[500], sub: 'All batches' },
                    { label: 'Employed', value: employed, icon: WorkIcon, accent: tokens.green[600], sub: `${placementRate}% placement rate` },
                    { label: 'Seeking Work', value: seeking, icon: PersonAddIcon, accent: tokens.navy[600], sub: 'Open to offers' },
                    { label: 'Open Disputes', value: pendingD, icon: GavelIcon, accent: pendingD > 0 ? tokens.red[600] : tokens.slate[200], sub: pendingD > 0 ? 'Needs attention' : 'All clear' },
                ].map(({ label, value, icon: Icon, accent, sub }) => (
                    <Grid item xs={6} md={3} key={label}>
                        <Box sx={{
                            bgcolor: '#fff', border: `1px solid ${tokens.slate[100]}`, borderRadius: 3,
                            p: '18px 20px', position: 'relative', overflow: 'hidden',
                            '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent, borderRadius: '3px 0 0 3px' },
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '2rem', fontWeight: 500, lineHeight: 1, color: tokens.navy[800] }}>
                                        {value}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300], mt: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {label}
                                    </Typography>
                                    {sub && <Typography sx={{ fontSize: '0.7rem', color: tokens.teal[600], mt: 0.5 }}>{sub}</Typography>}
                                </Box>
                                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon sx={{ fontSize: 18, color: accent }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Placement bar */}
            {students.length > 0 && (
                <Box sx={{ mb: 3, p: '14px 20px', bgcolor: '#fff', border: `1px solid ${tokens.slate[100]}`, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: tokens.navy[800] }}>Placement Overview</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', color: tokens.slate[300] }}>{employed} of {students.length} placed</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={placementRate}
                        sx={{ height: 8, borderRadius: 4, bgcolor: tokens.slate[100], '& .MuiLinearProgress-bar': { bgcolor: tokens.green[600], borderRadius: 4 } }} />
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: tokens.green[600] }}>● Employed: {employed}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: tokens.amber[600] }}>● Seeking: {seeking}</Typography>
                    </Box>
                </Box>
            )}

            <Grid container spacing={2.5}>
                {/* Student list */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6">Alumni & Placements</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>Recent students and their placement status</Typography>
                                </Box>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/institute/candidates')}>Full List</Button>
                            </Box>
                            {students.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: 40, color: tokens.slate[200], mb: 1 }} />
                                    <Typography sx={{ color: tokens.slate[300], fontSize: '0.875rem' }}>No students enrolled yet.</Typography>
                                    <Button size="small" variant="outlined" sx={{ mt: 1.5 }} onClick={() => navigate('/institute/onboard')}>Enroll First Student</Button>
                                </Box>
                            ) : (
                                students.slice(0, 7).map((s, i) => <StudentRow key={i} student={s} />)
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right column */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button fullWidth variant="contained" startIcon={<PersonAddIcon />} onClick={() => navigate('/institute/onboard')}
                                    sx={{ bgcolor: tokens.navy[800], '&:hover': { bgcolor: tokens.navy[700] } }}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="h6">Disputes</Typography>
                                {pendingD > 0 && (
                                    <Chip label={`${pendingD} pending`} size="small"
                                        sx={{ bgcolor: tokens.red[100], color: tokens.red[700], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                                )}
                            </Box>
                            {disputes.length === 0
                                ? <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '0.875rem', color: tokens.slate[300] }}>✓ No disputes on record</Typography>
                                </Box>
                                : disputes.slice(0, 3).map((d, i) => <DisputeRow key={i} dispute={d} />)
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InstituteHome;
