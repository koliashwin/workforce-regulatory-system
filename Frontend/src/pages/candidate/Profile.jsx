import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import candidateAPI from '../../api/modules/candidateAPI';
import { useAuth } from '../../context/AuthContext';
import PreviewTable from '../../components/PreviewTable';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();

    const employmentListColumns = [
        { label: "Company Name", key: "name" },
        { label: "CIN", key: "cin" },
        { label: "Joining", key: "joining_date" },
        { label: "Exit", key: "exit_date" },
        { label: "Status", key: "status" },
    ]

    const disputeListColumns = [
        { label: "Raised By", key: "raised_by_type" },
        { label: "Against", key: "raised_against_type" },
        { label: "Reason", key: "topic" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_on" },
    ]

    useEffect(() => {
        candidateAPI.getProfile(user.user_id)
            .then(res => { setProfile(res.data) })
            .catch(err => console.log(err));
    }, [])

    if (!profile) return <Typography>Loading profile...</Typography>

    return (
        // <>
        //     <Typography>profile test</Typography>
        //     {console.log("full personal: ", profile)}
        //     {console.log("personal info : ", profile.personal_info)}
        //     {console.log("academic info : ", profile.acdemic_info)}
        //     {console.log("employment history : ", profile.employment_history)}
        //     {console.log("dispute history : ", profile.dispute_history)}
        // </>
        <Box>
            {/* header */}
            <Typography variant='h3'>
                Candidate Profile
            </Typography>
            {console.log("full personal: ", profile)}
            {/* personal info */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant='h6'>Personal Information</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><b>Name : </b>{profile.personal_info.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Email : </b>{profile.personal_info.email}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Contact : </b>{profile.personal_info.contact_no}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>DOB : </b>{profile.personal_info.dob}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Candidate plans:</b> {profile.acdemic_info[0].future_plan}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Academic Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Academic Information</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><b>Course:</b> {profile.acdemic_info[0].course}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Passout Year:</b> {profile.acdemic_info[0].passout_year}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Skills:</b> {profile.acdemic_info[0].skills}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Institute Name:</b> {profile.acdemic_info[0].institute_name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Institute Status:</b> {profile.acdemic_info[0].institue_legal_status}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Candidate plans:</b> {profile.acdemic_info[0].future_plan}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Employment History */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Employment History</Typography>
                    <Divider sx={{ my: 1 }} />

                    {profile.employment_history.length == 0 ? (
                        <Typography>
                            Not employed yet
                        </Typography>
                    ) : (
                        <PreviewTable
                            title="Recent employment"
                            maxRows='5'
                            data={profile.employment_history}
                            viewAllPath='/candidate/disputes'
                            columns={employmentListColumns}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Disputes */}
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
                            viewAllPath='/candidate/disputes'
                            columns={disputeListColumns}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default Profile
