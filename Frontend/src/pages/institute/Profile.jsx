import { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import instituteAPI from "../../api/modules/instituteAPI";
import { tokens } from "../../theme/theme";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GavelIcon from "@mui/icons-material/Gavel";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/WorkOutline";

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

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

const StudentCard = ({ student }) => {
    const isEmployed = !!student.company_name;
    const skills = student.skills ? student.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    return (
        <Box sx={{
            p: 1.5, borderRadius: 2, border: `1px solid ${tokens.slate[100]}`, mb: 1, '&:last-child': { mb: 0 },
            bgcolor: '#fff', transition: 'box-shadow 0.15s',
            '&:hover': { boxShadow: '0 2px 8px rgba(13,17,23,0.06)' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Avatar sx={{ width: 38, height: 38, bgcolor: `${tokens.teal[500]}22`, color: tokens.teal[700], fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(student.student_name)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: tokens.navy[800] }}>{student.student_name}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{student.course} · {student.passout_year}</Typography>
                        </Box>
                        {isEmployed ? (
                            <Chip label="Employed" size="small" sx={{ bgcolor: tokens.green[100], color: tokens.green[700], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                        ) : (
                            <Chip label="Seeking" size="small" sx={{ bgcolor: tokens.amber[100], color: tokens.amber[600], fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                        )}
                    </Box>
                    {isEmployed && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <WorkIcon sx={{ fontSize: 12, color: tokens.green[600] }} />
                            <Typography sx={{ fontSize: '0.75rem', color: tokens.green[700], fontWeight: 500 }}>
                                {student.designation} at {student.company_name}
                            </Typography>
                        </Box>
                    )}
                    {skills.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                            {skills.slice(0, 3).map(skill => (
                                <Chip key={skill} label={skill} size="small"
                                    sx={{ bgcolor: tokens.slate[50], color: tokens.slate[400], fontSize: '0.65rem', height: 18, border: `1px solid ${tokens.slate[100]}` }} />
                            ))}
                            {skills.length > 3 && (
                                <Chip label={`+${skills.length - 3}`} size="small"
                                    sx={{ bgcolor: tokens.slate[50], color: tokens.slate[300], fontSize: '0.65rem', height: 18 }} />
                            )}
                        </Box>
                    )}
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
    const navigate = useNavigate();

    useEffect(() => {
        instituteAPI.instituteProfile()
            .then(res => setProfile(res.data))
            .catch(err => console.log(err));
    }, []);

    if (!profile) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: tokens.slate[300] }}>Loading institute profile…</Typography>
        </Box>
    );

    const info = profile.institute_info || {};
    const students = profile.institute_students || [];
    const disputes = profile.dispute_history || [];
    const isVerified = info.verification_status?.toLowerCase() === 'registered';
    const employed = students.filter(s => s.company_name).length;
    const placementRate = students.length ? Math.round((employed / students.length) * 100) : 0;

    return (
        <Box>
            {/* Hero header */}
            <Box sx={{
                mb: 3, p: 3, borderRadius: 3,
                background: `linear-gradient(135deg, ${tokens.navy[800]} 0%, ${tokens.navy[600]} 100%)`,
                position: 'relative', overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                <Box sx={{ position: 'absolute', bottom: -30, right: 60, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.12)', fontSize: '1.375rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)' }}>
                        {getInitials(info.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                                {info.name || 'Institute'}
                            </Typography>
                            <Chip
                                icon={isVerified ? <VerifiedIcon sx={{ fontSize: '13px !important', color: `${tokens.green[400]} !important` }} /> : <WarningAmberIcon sx={{ fontSize: '13px !important', color: `${tokens.amber[400]} !important` }} />}
                                label={isVerified ? 'Verified' : 'Unverified'} size="small"
                                sx={{ bgcolor: isVerified ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)', color: isVerified ? tokens.green[100] : tokens.amber[200], fontWeight: 600, fontSize: '0.7rem' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', mt: 0.25 }}>
                            {info.address || '—'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2.5, textAlign: 'center' }}>
                        {[
                            { label: 'Alumni', value: students.length },
                            { label: 'Placed', value: `${placementRate}%` },
                            { label: 'Disputes', value: disputes.length },
                        ].map(({ label, value }) => (
                            <Box key={label}>
                                <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{value}</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2.5}>
                {/* Left: info */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Institute Details</Typography>
                            <InfoRow icon={EmailIcon} label="Email" value={info.email} />
                            <InfoRow icon={PhoneIcon} label="Contact" value={info.contact_no} />
                            <InfoRow icon={LocationOnIcon} label="Address" value={info.address} />
                            <InfoRow icon={VerifiedIcon} label="Status" value={info.verification_status} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: students + disputes */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6">Alumni List</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{students.length} total · {employed} employed</Typography>
                                </Box>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/institute/candidates')}>View All</Button>
                            </Box>
                            {students.length === 0 ? (
                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: 36, color: tokens.slate[200], mb: 1 }} />
                                    <Typography sx={{ color: tokens.slate[300], fontSize: '0.875rem' }}>No students enrolled yet</Typography>
                                </Box>
                            ) : (
                                students.slice(0, 4).map((s, i) => <StudentCard key={i} student={s} />)
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                                disputes.slice(0, 5).map((d, i) => <DisputeCard key={i} dispute={d} />)
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
