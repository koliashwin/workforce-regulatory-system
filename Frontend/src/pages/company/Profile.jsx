import { useEffect, useState } from "react";
import companyAPI from "../../api/modules/companyAPI";
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme/theme";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Present';
const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active') return { bg: tokens.green[100], text: tokens.green[700] };
    if (s === 'exited') return { bg: tokens.red[100], text: tokens.red[700] };
    return { bg: tokens.slate[100], text: tokens.slate[400] };
};

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

const EmployeeCard = ({ emp }) => {
    const sc = getStatusStyle(emp.employee_status);
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
            borderRadius: 2, border: `1px solid ${tokens.slate[100]}`, mb: 1,
            '&:last-child': { mb: 0 },
            bgcolor: '#fff',
            transition: 'box-shadow 0.15s',
            '&:hover': { boxShadow: '0 2px 8px rgba(13,17,23,0.06)' }
        }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: `${tokens.teal[500]}22`, color: tokens.teal[700], fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                {getInitials(emp.employee_name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: tokens.navy[800] }}>{emp.employee_name}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{emp.designation}</Typography>
                {emp.employee_email && (
                    <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace' }}>{emp.employee_email}</Typography>
                )}
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Chip label={emp.employee_status || 'Unknown'} size="small"
                    sx={{ bgcolor: sc.bg, color: sc.text, fontWeight: 600, fontSize: '0.7rem', height: 20, mb: 0.5, display: 'block' }} />
                <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace' }}>
                    {formatDate(emp.joining_date)}
                </Typography>
                {emp.exit_date && (
                    <Typography sx={{ fontSize: '0.7rem', color: tokens.red[600], fontFamily: '"DM Mono", monospace' }}>
                        → {formatDate(emp.exit_date)}
                    </Typography>
                )}
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
            <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>
                {dispute.raised_by_type} → {dispute.raised_against_type}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace', mt: 0.25 }}>
                {formatDate(dispute.created_on)}
            </Typography>
        </Box>
    );
};

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        companyAPI.companyProfile()
            .then(res => setProfile(res.data))
            .catch(err => console.log(err));
    }, []);

    if (!profile) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: tokens.slate[300] }}>Loading company profile…</Typography>
        </Box>
    );

    const info = profile.company_info || {};
    const employees = profile.company_employees || [];
    const disputes = profile.dispute_history || [];
    const isVerified = info.verification_status?.toLowerCase() === 'registered';
    const active = employees.filter(e => !e.exit_date).length;

    return (
        <Box>
            {/* Hero header */}
            <Box sx={{
                mb: 3, p: 3, borderRadius: 3, background: `linear-gradient(135deg, ${tokens.navy[800]} 0%, ${tokens.navy[600]} 100%)`,
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
                                {info.name || 'Company'}
                            </Typography>
                            <Chip
                                icon={isVerified ? <VerifiedIcon sx={{ fontSize: '13px !important', color: `${tokens.green[600]} !important` }} /> : <WarningAmberIcon sx={{ fontSize: '13px !important', color: `${tokens.amber[600]} !important` }} />}
                                label={isVerified ? 'Verified' : 'Unverified'}
                                size="small"
                                sx={{ bgcolor: isVerified ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)', color: isVerified ? tokens.green[100] : tokens.amber[200], fontWeight: 600, fontSize: '0.7rem' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: '"DM Mono", monospace', mt: 0.25 }}>
                            CIN: {info.cin || '—'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'center' }}>
                        {[{ label: 'Employees', value: employees.length }, { label: 'Active', value: active }, { label: 'Disputes', value: disputes.length }].map(({ label, value }) => (
                            <Box key={label}>
                                <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{value}</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2.5}>
                {/* Left column: contact info */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Company Details</Typography>
                            <InfoRow icon={EmailIcon} label="Email" value={info.email} />
                            <InfoRow icon={PhoneIcon} label="Contact" value={info.contact_no} />
                            <InfoRow icon={LocationOnIcon} label="Address" value={info.address} />
                            <InfoRow icon={BadgeIcon} label="CIN" value={info.cin} />
                            <InfoRow icon={VerifiedIcon} label="Status" value={info.verification_status} />
                        </CardContent>
                    </Card>

                    {!isVerified && (
                        <Button fullWidth variant="contained" startIcon={<VerifiedIcon />} onClick={() => navigate('/company/verify')}
                            sx={{ bgcolor: tokens.amber[500], color: tokens.navy[900], fontWeight: 700, '&:hover': { bgcolor: tokens.amber[400] } }}>
                            Verify Your Company
                        </Button>
                    )}
                </Grid>

                {/* Right: employees + disputes */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6">Employee List</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{employees.length} total · {active} active</Typography>
                                </Box>
                                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/company/employees')}>
                                    View All
                                </Button>
                            </Box>
                            {employees.length === 0 ? (
                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                    <PersonIcon sx={{ fontSize: 36, color: tokens.slate[200], mb: 1 }} />
                                    <Typography sx={{ color: tokens.slate[300], fontSize: '0.875rem' }}>No employees yet</Typography>
                                </Box>
                            ) : (
                                employees.slice(0, 5).map((emp, i) => <EmployeeCard key={i} emp={emp} />)
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
