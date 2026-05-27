import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import publicAPI from '../../api/modules/publicAPI';

import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LockIcon from '@mui/icons-material/Lock';

// ── Hero stat box ─────────────────────────────────────────────────────────────
const HeroStat = ({ value, label, loading }) => (
    <Box sx={{ textAlign: 'center', px: 2 }}>
        {loading
            ? <Skeleton variant="text" width={80} height={52} sx={{ mx: 'auto', bgcolor: '#1e2636' }} />
            : <Typography sx={{
                fontFamily: 'monospace', fontSize: '2.25rem', fontWeight: 700,
                color: '#fff', lineHeight: 1
            }}>{value}</Typography>
        }
        <Typography sx={{
            fontSize: '11px', color: '#718096', mt: 0.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontFamily: 'monospace'
        }}>{label}</Typography>
    </Box>
);

// ── Why-we-need-this problem card ─────────────────────────────────────────────
const ProblemCard = ({ icon: Icon, title, desc, color }) => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{
            width: 38, height: 38, borderRadius: '9px', background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25
        }}>
            <Icon sx={{ fontSize: 18, color }} />
        </Box>
        <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 0.5 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{desc}</Typography>
        </Box>
    </Box>
);

// ── How it works step ─────────────────────────────────────────────────────────
const Step = ({ num, title, desc, actors }) => (
    <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{
                width: 34, height: 34, borderRadius: '50%', background: '#0d1117', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontFamily: 'monospace',
                fontSize: '13px', fontWeight: 700, border: '1px solid #1e2636'
            }}>{num}</Box>
            {<Box sx={{ width: 0.1, flex: 1, background: '#e2e8f0', my: 0.5, minHeight: 24 }} />}
        </Box>
        <Box sx={{ pb: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 0.25 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: 0.75 }}>{desc}</Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {actors.map(a => <Chip key={a} label={a} size="small"
                    sx={{ fontSize: '11px', height: 20, background: '#f7f9fc', border: '1px solid #e2e8f0' }} />)}
            </Box>
        </Box>
    </Box>
);

// ── Main component ────────────────────────────────────────────────────────────
const PublicHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicAPI.getPlatformStats()
            .then(res => setStats(res.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <Box sx={{
                background: '#0d1117',
                backgroundImage: 'radial-gradient(ellipse at 15% 60%, #1e263699 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, #d9770618 0%, transparent 50%)',
                pt: { xs: 7, md: 10 }, pb: { xs: 6, md: 8 },
            }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Chip label="Public Transparency Portal" size="small"
                        sx={{
                            mb: 3, background: '#1e2636', color: '#718096', fontFamily: 'monospace',
                            fontSize: '11px', letterSpacing: '0.06em', border: '1px solid #263142'
                        }} />

                    <Typography sx={{
                        fontFamily: 'Georgia, serif', fontWeight: 700, color: '#fff',
                        fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.2, mb: 2,
                    }}>
                        The system that makes<br />
                        <Box component="span" sx={{ color: '#f59e0b', fontStyle: 'italic' }}>scammers fear its existence</Box>
                    </Typography>

                    <Typography sx={{
                        fontSize: '1.0625rem', color: '#718096', lineHeight: 1.75,
                        maxWidth: 600, mx: 'auto', mb: 4
                    }}>
                        A verified, traceable record of every employment event in India.
                        Protecting candidates from unethical exit and joining, companies from fraudulent hires,
                        and institutes from impersonation.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                        <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/institutes')}
                            sx={{
                                background: '#f59e0b', color: '#0d1117', fontWeight: 600, px: 3,
                                '&:hover': { background: '#fbbf24' }
                            }}>
                            Browse Institutes
                        </Button>
                        <Button variant="outlined" size="large" endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/companies')}
                            sx={{
                                borderColor: '#263142', color: '#a0aec0', px: 3,
                                '&:hover': { borderColor: '#718096', color: '#fff', background: 'transparent' }
                            }}>
                            Browse Companies
                        </Button>
                    </Box>

                    {/* Live stats */}
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 5 },
                        borderTop: '1px solid #1e2636', pt: 4, flexWrap: 'wrap'
                    }}>
                        <HeroStat value={stats?.verified_companies ?? '-'} label="Verified Companies" loading={loading} />
                        <HeroStat value={stats?.institutes ?? '-'} label="Institutes" loading={loading} />
                        <HeroStat value={stats?.candidates ?? '-'} label="Candidates" loading={loading} />
                        <HeroStat value={stats?.disputes_resolved ?? '-'} label="Disputes Resolved" loading={loading} />
                    </Box>
                </Container>
            </Box>

            {/* ── Why this platform exists ────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 8 }, background: '#fff' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography variant="overline" sx={{ color: '#dc2626', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                                The Problem
                            </Typography>
                            <Typography sx={{
                                fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700,
                                lineHeight: 1.3, mt: 1, mb: 2
                            }}>
                                Unethical hiring and exit, Unemployment, Underemployment
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                India's hiring market is riddled with fraudulent resumes, backdated experience letters,
                                unethical exit practices, unverifiable degree claims and degree holders with next to no domain knowledge. The cost is borne entirely
                                by honest candidates who get filtered out and companies who unknowingly hire frauds.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <ProblemCard icon={WarningAmberIcon} color="#d97706" title="Fake experience letters"
                                    desc="Candidates forge employment records, inflating tenures by months or years. No mechanism existed to cross-verify." />
                                <ProblemCard icon={LockIcon} color="#dc2626" title="Backdated onboarding and exit records"
                                    desc="Companies manipulate onboarding dates. Candidates manipulate exit dates or documents. Both happen routinely with almost no audit trail." />
                                <ProblemCard icon={GavelIcon} color="#0d9488" title="Unverifiable degree claims"
                                    desc="Degrees from unaccredited or fake institutes are passed off as legitimate. No way for a recruiter to confirm without manually contacting the college." />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── How it works ────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 8 }, background: '#f7f9fc' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} justifyContent="center">
                        <Grid item xs={12} md={5}>
                            <Typography variant="overline" sx={{ color: '#0d9488', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                                How It Works
                            </Typography>
                            <Typography sx={{
                                fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700,
                                lineHeight: 1.3, mt: 1, mb: 3
                            }}>
                                Every event is verified by all actors involved.
                            </Typography>
                            <Step num={1} title="Institute enrolls candidate"
                                desc="The journey starts when an institute adds a student's academic record to the system : programme, year, and credentials."
                                actors={['Institute']} />
                            <Step num={2} title="Company onboards employee"
                                desc="When hired, the company registers the candidate's joining date. This record is locked and dispute-tracked."
                                actors={['Company']} />
                            <Step num={3} title="Candidate confirms joining"
                                desc="The candidate independently confirms their joining date. If it doesn't match, a dispute is automatically raised."
                                actors={['Candidate']} />
                            <Step num={4} title="Exit is recorded by both"
                                desc="Both company and candidate log the exit date. Mismatches trigger disputes. Disputes counts are publicly visible."
                                actors={['Company', 'Candidate']} />
                            <Step num={5} title="Record is verified and permanent"
                                desc="Once all dates match, the employment event is locked as verified, tamper-proof and available for any recruiter to check."
                                actors={['System', 'Public']} />
                        </Grid>

                        <Grid item xs={12} md={7} >
                            {/* Actor cards */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                {[
                                    {
                                        icon: SchoolIcon, title: 'Institutes', color: '#161b26',
                                        points: ['Track alumni employment outcomes', 'Prove degrees are legitimate', 'Protection against degree impersonation']
                                    },
                                    {
                                        icon: BusinessIcon, title: 'Companies', color: '#0d9488',
                                        points: ['Verified onboarding records', 'Transparent exit history', 'Evidence trail when a candidate misrepresents history']
                                    },
                                    {
                                        icon: VerifiedIcon, title: 'Candidates', color: '#d97706',
                                        points: ['Tamper-proof employment history', 'Evidence trail in case of disputes', 'Protection from unethical exit practices']
                                    },
                                ].map(({ icon: Icon, title, color, points }) => (
                                    <Card key={title} sx={{ border: '1px solid #e2e8f0' }} elevation={0}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                <Box sx={{
                                                    width: 32, height: 32, borderRadius: '8px', background: `${color}14`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Icon sx={{ fontSize: 17, color }} />
                                                </Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</Typography>
                                            </Box>
                                            {points.map(p => (
                                                <Box key={p} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.75 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 14, color: '#16a34a', mt: '2px', flexShrink: 0 }} />
                                                    <Typography variant="body2" color="text.secondary">{p}</Typography>
                                                </Box>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── Transparency block ───────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 8 }, background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant="overline" sx={{ color: '#4a5568', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                            Public Transparency
                        </Typography>
                        <Typography sx={{
                            fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700,
                            lineHeight: 1.3, mt: 1
                        }}>
                            Every institution's stats are visible to everyone.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 520, mx: 'auto' }}>
                            Placement rates, dispute counts, verification status, public by default.<br/>
                            Accountability is not optional.
                        </Typography>
                    </Box>
                    <Grid container spacing={2.5} justifyContent="center">
                        {[
                            { label: 'Placement rate per institute', icon: SchoolIcon, path: '/institutes', cta: 'Browse Institutes' },
                            { label: 'Dispute history per company', icon: GavelIcon, path: '/companies', cta: 'Browse Companies' },
                            { label: 'Verification status of employers', icon: VerifiedIcon, path: '/companies', cta: 'Check Companies' },
                        ].map(({ label, icon: Icon, path, cta }) => (
                            <Grid item xs={12} sm={4} key={label}>
                                <Card elevation={0} sx={{ border: '1px solid #e2e8f0', textAlign: 'center', py: 3 }}>
                                    <CardContent>
                                        <Icon sx={{ fontSize: 28, color: '#161b26', mb: 1 }} />
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 0.5 }}>{label}</Typography>
                                        <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate(path)}
                                            sx={{ mt: 1, color: '#0d9488' }}>{cta}</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Final CTA ────────────────────────────────────────────────── */}
            <Box sx={{ background: '#0d1117', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography sx={{
                        fontFamily: 'Georgia, serif', fontSize: '1.625rem', fontWeight: 700,
                        color: '#fff', mb: 1.5
                    }}>
                        Are you a candidate, institute, or company?
                    </Typography>
                    <Typography sx={{ color: '#718096', fontSize: '0.9375rem', mb: 3 }}>
                        Create your verified profile and join the platform that makes fraud harder to hide.
                    </Typography>
                    <Button variant="contained" size="large" component="a" onClick={() => navigate('/get-started')}
                        sx={{
                            background: '#f59e0b', color: '#0d1117', fontWeight: 600, px: 4,
                            '&:hover': { background: '#fbbf24' }
                        }}>
                        Get Started →
                    </Button>
                </Container>
            </Box>

        </Box>
    );
};

export default PublicHome;
