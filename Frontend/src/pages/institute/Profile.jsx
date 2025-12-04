import { useEffect, useState } from "react";
import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import instituteAPI from "../../api/modules/instituteAPI";
import { useAuth } from "../../context/AuthContext";
import PreviewTable from "../../components/PreviewTable";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();

    const studentListColumns = [
        { label: "Name", key: "student_name" },
        { label: "Contact", key: "student_contact" },
        { label: "Course", key: "course" },
        { label: "Passout", key: "passout_year" },
        { label: "Skills", key: "skills" },

        {
            label: "Working At",
            key: "company_name",
            render: (row) => row.company_name || "N/A"
        },
        {
            label: "Designation",
            key: "designation",
            render: (row) => row.designation || "N/A"
        },
    ]

    const disputeListColumns = [
        { label: "Raised By", key: "raised_by_type" },
        { label: "Against", key: "raised_against_type" },
        { label: "Reason", key: "topic" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_on" },
    ]

    // Fetch all data
    useEffect(() => {
        instituteAPI.instituteProfile(user.institute_id)
            .then(res => { setProfile(res.data) })
            .catch(err => console.log(err));
    }, []);

    if (!profile) return <Typography>Loading Institute profile...</Typography>;

    return (
        // <>
        //     {console.log("full data : ",profile)}
        // </>
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Institute Profile
            </Typography>


            {/* institute Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Institute Information</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>
                                <b>Name:</b> {profile.institute_info.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <b>Email:</b> {profile.institute_info.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography>
                                <b>Contact:</b> {profile.institute_info.contact_no}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                <b>Address:</b> {profile.institute_info.address}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                <b>Verification Status:</b> {profile.institute_info.verification_status}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Student List */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Alumni List</Typography>
                    <Divider sx={{ my: 1 }} />

                    <PreviewTable
                        title="Recent Students"
                        maxRows='3'
                        data={profile.institute_students}
                        viewAllPath='/institute/candidates'
                        columns={studentListColumns}
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
                        <PreviewTable
                            title="Recent Disputes"
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