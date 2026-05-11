import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';
import { useAuth } from '../../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OnboardEmployee = () => {
    const { user }  = useAuth();
    const [form, setForm] = useState({
        user_email:   '',
        designation:  '',
        joining_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult]   = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await companyAPI.joiningInitiate(form);
            setResult({ success: true, data: res.data });
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Failed to onboard employee' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 520 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Onboard Employee</Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
                Step 1 of the joining process — set the candidate's joining date
            </Typography>

            {result?.success && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    Joining initiated. The candidate will be notified to confirm their date.
                </Alert>
            )}
            {result && !result.success && (
                <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
            )}

            <Card>
                <CardContent>
                    <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
                        After you submit, the candidate must independently confirm their joining date.
                        If dates don't match, a dispute is automatically raised.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Candidate Email" name="user_email" type="email"
                            value={form.user_email} onChange={handleChange}
                            required sx={{ mb: 2 }}
                            helperText="Must match the candidate's registered email on the platform"
                        />
                        <TextField
                            fullWidth label="Designation / Role" name="designation"
                            value={form.designation} onChange={handleChange}
                            required sx={{ mb: 2 }}
                            placeholder="e.g. Software Engineer II"
                        />
                        <TextField
                            fullWidth label="Joining Date" name="joining_date" type="date"
                            value={form.joining_date} onChange={handleChange}
                            required InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                            helperText="The official joining date on your records"
                        />
                        <Button
                            type="submit" variant="contained" fullWidth disabled={loading}
                            sx={{ py: 1.25 }}>
                            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Initiate Joining →'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OnboardEmployee;