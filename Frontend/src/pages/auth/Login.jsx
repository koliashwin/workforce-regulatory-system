import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authAPI from '../../api/modules/authAPI';
import ShieldIcon from '@mui/icons-material/Shield';
import { tokens } from '../../theme/theme';
import { decodeToken } from '../../utils/decodeToken';

const redirectMap = { candidate: '/candidate', institute: '/institute', company: '/company', admin: '/admin' };

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.role) navigate(redirectMap[user.role]);
    }, [user, navigate]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authAPI.login({ email: form.email, password: form.password });
            const decoded = decodeToken(res.data.access_token)

            // login({ role: res.data.role, user_id: res.data.user_id, company_id: res.data.company_id, institute_id: res.data.institute_id });
            login({
                access_token:   res.data.access_token,
                token_type:     res.data.token_type,
                role:           decoded.role,
                user_id:        decoded.user_id,
                email:          decoded.email,
                role_code:      decoded.role_code,
                institute_id:   decoded.institute_id,
                company_id:     decoded.company_id
            })
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', background: tokens.navy[900],
            backgroundImage: `radial-gradient(ellipse at 20% 50%, ${tokens.navy[700]}44 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${tokens.amber[500]}11 0%, transparent 50%)`,
        }}>
            {/* Left branding panel */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center',
                width: 400, px: 6, borderRight: `1px solid ${tokens.navy[700]}`,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: tokens.amber[500], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldIcon sx={{ fontSize: 22, color: tokens.navy[900] }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: '1.375rem', color: '#fff', lineHeight: 1 }}>Workforce</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: tokens.slate[300], fontFamily: '"DM Mono", monospace', letterSpacing: '0.1em' }}>REGULATORY SYSTEM</Typography>
                    </Box>
                </Box>

                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.625rem', color: '#fff', lineHeight: 1.3, mb: 2 }}>
                    The system that makes scammers fear its existence.
                </Typography>
                <Typography variant="body2" sx={{ color: tokens.slate[300], lineHeight: 1.7 }}>
                    A trusted platform for verifying employment history, academic credentials, and exit records — protecting candidates, companies, and institutes alike.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                        ['Tamper-proof records', 'Every event is timestamped and cross-verified'],
                        ['Auto dispute detection', 'Date mismatches instantly trigger resolution flows'],
                        ['Three-actor verification', 'Institutes, companies & candidates all confirm events'],
                    ].map(([title, desc]) => (
                        <Box key={title} sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: tokens.amber[500], mt: '7px', flexShrink: 0 }} />
                            <Box>
                                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>{title}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: tokens.slate[300] }}>{desc}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Right login form */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
                <Card sx={{ width: '100%', maxWidth: 400, background: tokens.white }}>
                    <CardContent sx={{ p: '32px !important' }}>
                        {/* Mobile logo */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 3 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: tokens.amber[500], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldIcon sx={{ fontSize: 18, color: tokens.navy[900] }} />
                            </Box>
                            <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, color: tokens.navy[800] }}>Workforce</Typography>
                        </Box>

                        <Typography variant="h4" sx={{ mb: 0.5 }}>Sign in</Typography>
                        <Typography variant="subtitle1" sx={{ mb: 3 }}>Enter your credentials to access your portal</Typography>

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                fullWidth label="Email address" name="email" type="email"
                                value={form.email} onChange={handleChange} required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth label="Password" name="password" type="password"
                                value={form.password} onChange={handleChange} required
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit" fullWidth variant="contained" size="large"
                                disabled={loading}
                                sx={{ py: 1.25, fontSize: '0.9375rem' }}
                            >
                                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
                            </Button>
                        </Box>

                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2.5, color: tokens.slate[300] }}>
                            Role is determined by your registered account type.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Login;
