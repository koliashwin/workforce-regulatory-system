import { useEffect, useState } from "react";
import companyAPI from "../../api/modules/companyAPI";
import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/DataTable";

const Profile = () => {
    const [profile, setProfile] = useState(null);

    const employeeListColumns = [
        { label: "Name", key: "employee_name" },
        { label: "Email", key: "employee_email" },
        { label: "Contact", key: "employee_contact" },
        { label: "Designation", key: "designation" },
        { label: "Joining Date", key: "joining_date" },
        { label: "Exit Date", key: "exit_date", render: (row) => row.exit_date || "Present"},
        { label: "Status", key: "employee_status", isStatus: true },
    ]

    const disputeListColumns = [
        { label: "Raised By", key: "raised_by_type" },
        { label: "Against", key: "raised_against_type" },
        { label: "Reason", key: "topic" },
        { label: "Status", key: "status", isStatus: true },
        { label: "Created At", key: "created_on" },
    ]

    // Fetch all data
    useEffect(() => {
        companyAPI.companyProfile()
            .then(res => { setProfile(res.data) })
            .catch(err => console.log(err));
    }, []);

    if (!profile) return <Typography>Loading company profile...</Typography>;

    return (

        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Company Profile
            </Typography>

            {/* Company Information */}
            <Card sx={{ mb: 3, borderRadius: 3, maxWidth: '600px' }}>
                <CardContent>
                    <Typography variant="h6">Company Information</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>
                                <b>Name:</b> {profile.company_info.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <b>Email:</b> {profile.company_info.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography>
                                <b>CIN:</b> {profile.company_info.cin}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <b>Contact:</b> {profile.company_info.contact_no}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                <b>Address:</b> {profile.company_info.address}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                <b>Verification Status:</b> {profile.company_info.verification_status}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Employee List */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h6">Employee List</Typography>
                    <Divider sx={{ my: 1 }} />

                    <DataTable 
                        // title={'Recent Joinees'}
                        maxRows={5}
                        data={profile.company_employees}
                        viewAllPath={'/company/employees'}
                        columns={employeeListColumns}
                    />
                </CardContent>
            </Card>

            {/* Disputes List */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Disputes History</Typography>
                    <Divider sx={{ my: 1 }} />

                    {profile.dispute_history.length == 0 ? (
                        <Typography>
                            No disputes yet
                        </Typography>
                    ) : (
                        <DataTable
                            // title="Recent Disputes"
                            maxRows='5'
                            data={profile.dispute_history}
                            viewAllPath='/institute/disputes'
                            columns={disputeListColumns}
                        />
                    )}

                </CardContent>
            </Card>
        </Box>
    );
}

export default Profile;