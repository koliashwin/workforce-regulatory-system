import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EmployeeExits = () => {
    const [form, setForm] = useState({
        user_email: '',
        exit_date:  '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult]   = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await companyAPI.exitInitiate(form);
            setResult({ success: true, data: res.data });
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Failed to initiate exit' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 520 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Record Employee Exit</Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
                Step 1 of the exit process — set the employee's last working day
            </Typography>

            {result?.success && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    Exit initiated. The candidate must confirm their exit date and verify exit documents.
                </Alert>
            )}
            {result && !result.success && (
                <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
            )}

            <Card>
                <CardContent>
                    <Alert severity="warning" sx={{ mb: 2, fontSize: '12px' }}>
                        The candidate must have completed their joining process before exit can be initiated.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Employee Email" name="user_email" type="email"
                            value={form.user_email} onChange={handleChange}
                            required sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth label="Last Working Day" name="exit_date" type="date"
                            value={form.exit_date} onChange={handleChange}
                            required InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                            helperText="The official last working day on your records"
                        />
                        <Button
                            type="submit" variant="contained" fullWidth disabled={loading}
                            sx={{ py: 1.25 }}>
                            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Initiate Exit →'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeeExits;