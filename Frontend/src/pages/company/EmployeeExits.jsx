import { useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Tab, Tabs, TextField, Typography
} from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';
import BulkUpload from '../../components/BulkUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const EXIT_COLUMNS = [
    { key: 'user_email', label: 'Email', mono: true },
    { key: 'exit_date', label: 'Exit Date', mono: true },
];

const SingleForm = () => {
    const [form, setForm] = useState({ user_email: '', exit_date: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            await companyAPI.exitInitiate(form);
            setResult({ success: true });
            setForm({ user_email: '', exit_date: '' });
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Failed to initiate exit' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', mt: 2 }}>
            <CardContent sx={{ p: '24px !important' }}>
                {result?.success && (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                        Exit initiated. The candidate must confirm their exit date and verify exit documents.
                    </Alert>
                )}
                {result && !result.success && (
                    <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
                )}
                <Alert severity="warning" sx={{ mb: 2, fontSize: '12px' }}>
                    The candidate must have completed their joining process before exit can be initiated.
                </Alert>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Employee Email" name="user_email" type="email"
                        value={form.user_email} onChange={handleChange} required sx={{ mb: 2 }} />
                    <TextField fullWidth label="Last Working Day" name="exit_date" type="date"
                        value={form.exit_date} onChange={handleChange} required
                        InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                        helperText="The official last working day on your records" />
                    <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.25 }}>
                        {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Initiate Exit →'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const EmployeeExits = () => {
    const [tab, setTab] = useState(0);

    const uploadExitRow = (row) =>
        companyAPI.exitInitiate({
            user_email: row.user_email,
            exit_date: normalizeExcelDate(row.exit_date),
        });

    return (
        <Box sx={{ maxWidth: 720 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Record Employee Exit</Typography>
                <Typography variant="subtitle1">
                    Initiate the exit process for one employee or process multiple exits at once.
                </Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: '1px solid #e2e8f0' }}>
                <Tab label="Single Exit" icon={<ExitToAppIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
                <Tab label="Bulk Upload" icon={<UploadFileIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
            </Tabs>
            {tab === 0 && <SingleForm />}
            {tab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <BulkUpload
                        columns={EXIT_COLUMNS}
                        onUploadRow={uploadExitRow}
                        templateName="employee_exit_template.xlsx"
                        previewCols={['user_email', 'exit_date']}
                        templateSample={[
                            ['alice@example.com', '2024-09-30'],
                            ['bob@example.com', '2024-10-15'],
                        ]}
                        infoMessage="Candidates must have completed joining before exit can be initiated. Each employee will need to confirm their exit date and verify exit documents after upload."
                    />
                </Box>
            )}
        </Box>
    );
};

export default EmployeeExits;
