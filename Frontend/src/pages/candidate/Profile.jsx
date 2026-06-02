import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import candidateAPI from '../../api/modules/candidateAPI';
import { tokens } from '../../theme/theme';

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/WorkOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import BuildIcon from "@mui/icons-material/Build";
import FlagIcon from "@mui/icons-material/Flag";

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Present';

const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5, borderBottom: `1px solid ${tokens.slate[100]}`, '&:last-child': { borderBottom: 'none' } }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: tokens.slate[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
            <Icon sx={{ fontSize: 16, color: tokens.slate[300] }} />
        </Box>
        <Box>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300], fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: tokens.navy[800], fontWeight: 500, mt: 0.25 }}>{value || '—'}</Typography>
        </Box>
    </Box>
);

const EmploymentCard = ({ job }) => {
    const isActive = !job.exit_date;
    return (
        <Box sx={{
            p: 2, borderRadius: 2, border: `1px solid ${tokens.slate[100]}`, mb: 1, '&:last-child': { mb: 0 },
            bgcolor: isActive ? tokens.green[50] : '#fff',
            borderColor: isActive ? tokens.green[100] : tokens.slate[100],
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: tokens.navy[800] }}>{job.name}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: tokens.slate[400], fontFamily: '"DM Mono", monospace' }}>{job.cin}</Typography>
                </Box>
                <Chip
                    label={isActive ? 'Current' : job.status || 'Exited'} size="small"
                    sx={{
                        bgcolor: isActive ? tokens.green[100] : tokens.slate[100],
                        color: isActive ? tokens.green[700] : tokens.slate[400],
                        fontWeight: 600, fontSize: '0.7rem', height: 22
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tokens.green[600] }} />
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace' }}>
                        {formatDate(job.joining_date)}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>→</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isActive ? tokens.teal[500] : tokens.slate[300] }} />
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace' }}>
                        {formatDate(job.exit_date)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const DisputeCard = ({ dispute }) => {
    const isPending = dispute.status === 'pending';
    return (
        <Box sx={{
            p: 1.5, borderRadius: 2, mb: 1, '&:last-child': { mb: 0 },
            bgcolor: isPending ? tokens.red[50] : tokens.slate[50],
            border: `1px solid ${isPending ? tokens.red[100] : tokens.slate[100]}`,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: tokens.navy[800] }}>{dispute.topic}</Typography>
                <Chip label={dispute.status} size="small"
                    sx={{ bgcolor: isPending ? tokens.red[100] : tokens.slate[100], color: isPending ? tokens.red[700] : tokens.slate[400], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{dispute.raised_by_type} → {dispute.raised_against_type}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace', mt: 0.25 }}>{formatDate(dispute.created_on)}</Typography>
        </Box>
    );
};

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        candidateAPI.getProfile()
            .then(res => setProfile(res.data))
            .catch(err => console.log(err));
    }, []);

    if (!profile) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: tokens.slate[300] }}>Loading profile…</Typography>
        </Box>
    );

    const personal = profile.personal_info || {};
    const academic = profile.acdemic_info?.[0] || {};
    const employment = profile.employment_history || [];
    const disputes = profile.dispute_history || [];
    const skills = academic.skills ? academic.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const currentJob = employment.find(j => !j.exit_date);

    return (
        <Box>
            {/* Hero header */}
            <Box sx={{
                mb: 3, p: 3, borderRadius: 3,
                background: `linear-gradient(135deg, ${tokens.navy[800]} 0%, ${tokens.teal[700]} 100%)`,
                position: 'relative', overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                <Box sx={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative' }}>
                    <Avatar sx={{ width: 72, height: 72, bgcolor: 'rgba(255,255,255,0.15)', fontSize: '1.5rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.25)' }}>
                        {getInitials(personal.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.625rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                            {personal.name || 'Candidate'}
                        </Typography>
                        {currentJob ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                                <WorkIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                    Currently at {currentJob.name}
                                </Typography>
                            </Box>
                        ) : academic.course ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                                <SchoolIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                    {academic.course} · {academic.passout_year}
                                </Typography>
                            </Box>
                        ) : null}
                        {academic.future_plan && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                                <FlagIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>{academic.future_plan}</Typography>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2.5, textAlign: 'center' }}>
                        {[
                            { label: 'Jobs', value: employment.length },
                            { label: 'Disputes', value: disputes.length },
                            { label: 'Skills', value: skills.length },
                        ].map(({ label, value }) => (
                            <Box key={label}>
                                <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{value}</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2} justifyContent='center'>
                {/* Left column */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Personal Info</Typography>
                            <InfoRow icon={EmailIcon} label="Email" value={personal.email} />
                            <InfoRow icon={PhoneIcon} label="Contact" value={personal.contact_no} />
                            <InfoRow icon={CakeIcon} label="Date of Birth" value={personal.dob} />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Academic Info</Typography>
                            <InfoRow icon={SchoolIcon} label="Institute" value={academic.institute_name} />
                            <InfoRow icon={SchoolIcon} label="Course" value={academic.course} />
                            <InfoRow icon={SchoolIcon} label="Passout Year" value={academic.passout_year} />
                            {academic.institue_legal_status && (
                                <InfoRow icon={WorkIcon} label="Institute Status" value={academic.institue_legal_status} />
                            )}
                        </CardContent>
                    </Card>

                </Grid>

                {/* middle column */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <WorkIcon sx={{ fontSize: 18, color: tokens.slate[300] }} />
                                <Box>
                                    <Typography variant="h6">Employment History</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{employment.length} position{employment.length !== 1 ? 's' : ''}</Typography>
                                </Box>
                            </Box>
                            {employment.length === 0 ? (
                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                    <WorkIcon sx={{ fontSize: 36, color: tokens.slate[200], mb: 1 }} />
                                    <Typography sx={{ color: tokens.slate[300], fontSize: '0.875rem' }}>No employment history yet</Typography>
                                </Box>
                            ) : (
                                employment.map((job, i) => <EmploymentCard key={i} job={job} />)
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <GavelIcon sx={{ fontSize: 18, color: tokens.slate[300] }} />
                                <Box>
                                    <Typography variant="h6">Dispute History</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{disputes.length} total</Typography>
                                </Box>
                            </Box>
                            {disputes.length === 0 ? (
                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                    <GavelIcon sx={{ fontSize: 36, color: tokens.slate[200], mb: 1 }} />
                                    <Typography sx={{ color: tokens.slate[300], fontSize: '0.875rem' }}>No disputes on record</Typography>
                                </Box>
                            ) : (
                                disputes.map((d, i) => <DisputeCard key={i} dispute={d} />)
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                {/* right column */}
                <Grid item xs={12} md={4}>
                    {skills.length > 0 && (
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <BuildIcon sx={{ fontSize: 16, color: tokens.slate[300] }} />
                                    <Typography variant="h6">Skills</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {skills.map(skill => (
                                        <Chip key={skill} label={skill} size="small"
                                            sx={{ bgcolor: tokens.teal[50], color: tokens.teal[700], fontWeight: 500, fontSize: '0.75rem', border: `1px solid ${tokens.teal[100]}` }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
