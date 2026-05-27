import { useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Container, Divider, InputAdornment, Step, StepLabel,
    Stepper, TextField, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import publicAPI from '../../api/modules/publicAPI';

const STEPS = ['Verify CIN', 'Company Details', 'Done'];

const RegisterCompany = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 state
    const [cin, setCin] = useState('');
    const [cinResult, setCinResult] = useState(null); // null | {verified, details}

    // Step 2 state
    const [form, setForm] = useState({
        user_name: '',
        name: '',
        cin: '',
        address: '',
        contact_no: '',
        email: '',
    });

    // ── Step 1: Verify CIN ────────────────────────────────────
    const handleCinVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setCinResult(null);
        try {
            const res = await publicAPI.verifyCin(cin.trim());
            setCinResult(res.data);
            // if (res.data.verified) {
            // Pre-fill form with MCA data
            setForm(prev => ({
                ...prev,
                cin: cin.trim(),
                name: res.data.details?.['Company Name'] || '',
                address: res.data.details?.['Registered Address'] || '',
            }));
            setActiveStep(1);
            // }
        } catch (err) {
            setError(err.response?.data?.detail || 'CIN verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Register company ──────────────────────────────
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await publicAPI.registerCompany(form)
            setActiveStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 6, minHeight: '80vh' }}>
            <Container maxWidth="sm">
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '10px', background: '#f0fdfa',
                        border: '1px solid #0d948822', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BusinessIcon sx={{ fontSize: 20, color: '#0d9488' }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.1 }}>
                            Register Company
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join the verified employment platform
                        </Typography>
                    </Box>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* ── Step 1: CIN Verification ── */}
                {activeStep === 0 && (
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: '24px !important' }}>
                            <Typography variant="h6" sx={{ mb: 0.5 }}>Verify your CIN</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                Enter your Company Identification Number. We'll verify it against the MCA database before registration.
                            </Typography>
                            <Box component="form" onSubmit={handleCinVerify}>
                                <TextField
                                    fullWidth label="Company Identification Number (CIN)"
                                    value={cin} onChange={e => setCin(e.target.value.toUpperCase())}
                                    required placeholder="e.g. L16484TN1992PTC203527"
                                    inputProps={{ style: { fontFamily: 'monospace', letterSpacing: '0.05em' } }}
                                    helperText="alphanumeric code issued by MCA"
                                    sx={{ mb: 2 }}
                                />
                                <Button type="submit" variant="contained" fullWidth
                                    disabled={loading || cin.trim().length < 15}
                                    sx={{ py: 1.25 }}>
                                    {loading
                                        ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                                        : 'Verify CIN →'}
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                )}

                {/* ── Step 2: Company Details ── */}
                {activeStep === 1 && (
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: '24px !important' }}>
                            {cinResult?.verified ?
                                <Alert severity="success" icon={<VerifiedIcon />} sx={{ mb: 2.5 }}>
                                    CIN verified. {cinResult.details?.['Company Name'] || 'Company'} is registered and active in MCA.
                                </Alert>
                                :
                                <Alert severity='warning' sx={{mb: 2.5}}>
                                    CIN not found in MCA database you can still register but your account will be marked <strong>Unverified</strong> until verification is confirmed.
                                </Alert>
                            }

                            <Typography variant="h6" sx={{ mb: 0.5 }}>Company Details</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                Fill in your contact details. Your login email and default password will be sent after registration.
                            </Typography>

                            <Box component="form" onSubmit={handleRegister}>
                                <TextField
                                    fullWidth label="Company Name" name="name"
                                    value={form.name} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    helperText="Pre-filled from MCA, edit if needed"
                                />
                                <TextField
                                    fullWidth label="CIN" name="cin"
                                    value={form.cin}
                                    disabled
                                    sx={{ mb: 2 }}
                                    inputProps={{ style: { fontFamily: 'monospace' } }}
                                />
                                <TextField
                                    fullWidth label="Your Name (Account Owner)" name="user_name"
                                    value={form.user_name} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    placeholder="Full name of the HR / admin contact"
                                />
                                <TextField
                                    fullWidth label="Login Email" name="email" type="email"
                                    value={form.email} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    helperText="This will be your login email"
                                />
                                <TextField
                                    fullWidth label="Contact Number" name="contact_no"
                                    value={form.contact_no} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    inputProps={{ maxLength: 10 }}
                                />
                                <TextField
                                    fullWidth label="Registered Address" name="address"
                                    value={form.address} onChange={handleChange}
                                    required multiline rows={2} sx={{ mb: 2.5 }}
                                    helperText="Pre-filled from MCA, edit if needed"
                                />

                                <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
                                    Your default password will be <strong>Abced@12345</strong>, please change it after your first login.
                                </Alert>

                                <Button type="submit" variant="contained" fullWidth
                                    disabled={loading} sx={{ py: 1.25 }}>
                                    {loading
                                        ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                                        : 'Register Company →'}
                                </Button>
                                <Button variant="text" fullWidth sx={{ mt: 1 }}
                                    onClick={() => setActiveStep(0)}>
                                    ← Back
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* ── Step 3: Success ── */}
                {activeStep === 2 && (
                    <Card elevation={0} sx={{ border: '1px solid #bbf7d0', borderLeft: '3px solid #16a34a', borderRadius: '0 12px 12px 0' }}>
                        <CardContent sx={{ textAlign: 'center', py: 5, px: 4 }}>
                            <CheckCircleIcon sx={{ fontSize: 52, color: '#16a34a', mb: 1.5 }} />
                            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.5rem', mb: 1 }}>
                                Company Registered
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                                <strong>{form.name}</strong> is now on the platform. Login with <strong>{form.email}</strong> and the default password <strong>Abced@12345</strong>. Remember to verify your CIN from your company dashboard before onboarding employees.
                            </Typography>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/login')} sx={{ px: 4 }}>
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Already registered */}
                {activeStep < 2 && (
                    <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '13px', color: '#718096' }}>
                        Already registered?{' '}
                        <Box component="span" onClick={() => navigate('/login')}
                            sx={{ color: '#0d9488', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                            Sign in
                        </Box>
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default RegisterCompany;
