import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const roles = [
    {
        key: 'institute',
        icon: SchoolIcon,
        title: 'I represent an Institute',
        desc: 'Register your college, university, or training institute. Enroll students and track their placement outcomes.',
        path: '/register/institute',
        color: '#161b26',
        bg: '#f7f9fc',
    },
    {
        key: 'company',
        icon: BusinessIcon,
        title: 'I represent a Company',
        desc: 'Register your company, verify via CIN, and onboard employees with tamper-proof joining records.',
        path: '/register/company',
        color: '#0d9488',
        bg: '#f0fdfa',
    },
];

const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 6 }}>
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography sx={{
                        fontFamily: 'Georgia, serif', fontWeight: 700,
                        fontSize: '2rem', lineHeight: 1.2, mb: 1,
                    }}>
                        Join the platform
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select your role to get started. Candidates are enrolled by their institute.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {roles.map(({ key, icon: Icon, title, desc, path, color, bg }) => (
                        <Card
                            key={key}
                            elevation={0}
                            onClick={() => navigate(path)}
                            sx={{
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.18s',
                                '&:hover': {
                                    borderColor: color,
                                    boxShadow: `0 4px 20px ${color}18`,
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: '20px 24px !important' }}>
                                <Box sx={{
                                    width: 48, height: 48, borderRadius: '12px',
                                    background: bg, border: `1px solid ${color}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Icon sx={{ fontSize: 24, color }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.25 }}>
                                        {title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                        {desc}
                                    </Typography>
                                </Box>
                                <ArrowForwardIcon sx={{ color: '#a0aec0', flexShrink: 0 }} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Candidate note */}
                <Box sx={{
                    mt: 3, p: 2, borderRadius: '10px',
                    background: '#fffbeb', border: '1px solid #fde68a',
                }}>
                    <Typography sx={{ fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                        <strong>Are you a candidate?</strong> Candidates are enrolled by their institute — you don't register yourself. Ask your college or training institute to add you to the platform.
                    </Typography>
                </Box>

                <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '13px', color: '#718096' }}>
                    Already have an account?{' '}
                    <Box component="span"
                        onClick={() => navigate('/login')}
                        sx={{ color: '#0d9488', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                        Sign in
                    </Box>
                </Typography>
            </Container>
        </Box>
    );
};

export default GetStarted;
