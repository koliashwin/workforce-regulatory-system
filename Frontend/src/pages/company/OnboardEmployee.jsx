import { useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Tab, Tabs, TextField, Typography
} from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';
import BulkUpload from '../../components/BulkUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const EMPLOYEE_COLUMNS = [
    { key: 'user_email', label: 'Email', mono: true },
    { key: 'designation', label: 'Designation' },
    { key: 'joining_date', label: 'Joining Date', mono: true },
];

const SingleForm = () => {
    const [form, setForm] = useState({
        user_email: '', designation: '', joining_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            await companyAPI.joiningInitiate(form);
            setResult({ success: true });
            setForm({ user_email: '', designation: '', joining_date: '' });
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Failed to onboard employee' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', mt: 2 }}>
            <CardContent sx={{ p: '24px !important' }}>
                {result?.success && (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                        Joining initiated. The candidate must confirm their joining date.
                    </Alert>
                )}
                {result && !result.success && (
                    <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
                )}
                <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
                    After submission the candidate must independently confirm their joining date.
                    A mismatch automatically raises a dispute.
                </Alert>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Candidate Email" name="user_email" type="email"
                        value={form.user_email} onChange={handleChange} required sx={{ mb: 2 }}
                        helperText="Must match the candidate's registered email on the platform" />
                    <TextField fullWidth label="Designation / Role" name="designation"
                        value={form.designation} onChange={handleChange} required sx={{ mb: 2 }}
                        placeholder="e.g. Software Engineer II" />
                    <TextField fullWidth label="Joining Date" name="joining_date" type="date"
                        value={form.joining_date} onChange={handleChange} required
                        InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                        helperText="The official joining date on your records" />
                    <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.25 }}>
                        {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Initiate Joining →'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const OnboardEmployee = () => {
    const [tab, setTab] = useState(0);

    const uploadEmployeeRow = (row) =>
        companyAPI.joiningInitiate({
            user_email: row.user_email,
            designation: row.designation,
            joining_date: row.joining_date,
        });

    return (
        <Box sx={{ maxWidth: 720 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Onboard Employee</Typography>
                <Typography variant="subtitle1">
                    Initiate the joining process for one employee or upload a bulk list.
                </Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: '1px solid #e2e8f0' }}>
                <Tab label="Single Employee" icon={<PersonAddIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
                <Tab label="Bulk Upload" icon={<UploadFileIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
            </Tabs>
            {tab === 0 && <SingleForm />}
            {tab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <BulkUpload
                        columns={EMPLOYEE_COLUMNS}
                        onUploadRow={uploadEmployeeRow}
                        templateName="employee_onboard_template.xlsx"
                        previewCols={['user_email', 'designation', 'joining_date']}
                        templateSample={[
                            ['alice@example.com', 'Software Engineer II', '2024-03-01'],
                            ['bob@example.com', 'Product Manager', '2024-03-15'],
                        ]}
                        infoMessage="Each candidate must confirm their joining date after upload. Emails must match registered accounts on the platform."
                    />
                </Box>
            )}
        </Box>
    );
};

export default OnboardEmployee;
