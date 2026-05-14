import { useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Container, Step, StepLabel, Stepper, TextField, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import publicAPI from '../../api/modules/publicAPI';

const STEPS = ['Institute Details', 'Done'];

const RegisterInstitute = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');

    const [form, setForm] = useState({
        user_name:   '',
        name:        '',
        cin:         '',       // institute code / AISHE code
        address:     '',
        contact_no:  '',
        email:       '',
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await publicAPI.registerInstitute(form);
            setActiveStep(1);
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
                        width: 40, height: 40, borderRadius: '10px', background: '#f7f9fc',
                        border: '1px solid #16182622', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <SchoolIcon sx={{ fontSize: 20, color: '#161b26' }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.1 }}>
                            Register Institute
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enroll your institution and track alumni outcomes
                        </Typography>
                    </Box>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* ── Step 1: Details form ── */}
                {activeStep === 0 && (
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: '24px !important' }}>
                            <Typography variant="h6" sx={{ mb: 0.5 }}>Institute Details</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                Register your college, university, or training institution.
                                After registration you can start enrolling students.
                            </Typography>

                            <Box component="form" onSubmit={handleRegister}>
                                <TextField
                                    fullWidth label="Institute Name" name="name"
                                    value={form.name} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    placeholder="e.g. Sunrise University of Technology"
                                />
                                <TextField
                                    fullWidth label="AISHE / Institute Code" name="cin"
                                    value={form.cin} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    placeholder="e.g. C-43210"
                                    helperText="AISHE code or any unique government registration code"
                                />
                                <TextField
                                    fullWidth label="Your Name (Account Owner)" name="user_name"
                                    value={form.user_name} onChange={handleChange}
                                    required sx={{ mb: 2 }}
                                    placeholder="Full name of the admin contact"
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
                                    fullWidth label="Address" name="address"
                                    value={form.address} onChange={handleChange}
                                    required multiline rows={2} sx={{ mb: 2.5 }}
                                />

                                <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
                                    Your default password will be <strong>Abced@12345</strong> — please change it after your first login.
                                </Alert>

                                <Button type="submit" variant="contained" fullWidth
                                    disabled={loading} sx={{ py: 1.25 }}>
                                    {loading
                                        ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                                        : 'Register Institute →'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* ── Step 2: Success ── */}
                {activeStep === 1 && (
                    <Card elevation={0} sx={{ border: '1px solid #bbf7d0', borderLeft: '3px solid #16a34a', borderRadius: '0 12px 12px 0' }}>
                        <CardContent sx={{ textAlign: 'center', py: 5, px: 4 }}>
                            <CheckCircleIcon sx={{ fontSize: 52, color: '#16a34a', mb: 1.5 }} />
                            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.5rem', mb: 1 }}>
                                Institute Registered
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                                <strong>{form.name}</strong> is now on the platform. Login with <strong>{form.email}</strong> and the default password <strong>Abced@12345</strong>. You can start enrolling students right away from your dashboard.
                            </Typography>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/login')} sx={{ px: 4 }}>
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {activeStep < 1 && (
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

export default RegisterInstitute;
