import { Box, Card, CardContent, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import candidateAPI from '../../api/modules/candidateAPI';
import companyAPI from '../../api/modules/companyAPI';

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        candidateAPI.getProfile(1)
            .then(res => {setProfile(res.data)})
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

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Company</TableCell>
                                <TableCell>CIN</TableCell>
                                <TableCell>Joining</TableCell>
                                <TableCell>Exit</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profile.employment_history.map((emp_history, index) => (
                                <TableRow key={index}>
                                    <TableCell>{emp_history.name}</TableCell>
                                    <TableCell>{emp_history.cin}</TableCell>
                                    <TableCell>{emp_history.joining_date}</TableCell>
                                    <TableCell>{emp_history.exit_date || "Present"}</TableCell>
                                    <TableCell>{emp_history.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Disputes */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Disputes History</Typography>
                    <Divider sx={{ my: 1 }} />

                    {profile.length === 0 ? (
                        <Typography>No disputes found</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Raised By</TableCell>
                                    <TableCell>Raised Against</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {profile.dispute_history.map((dispute, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{dispute.raised_by_type}</TableCell>
                                        <TableCell>{dispute.raised_against_type}</TableCell>
                                        <TableCell>{dispute.topic}</TableCell>
                                        <TableCell>{dispute.status}</TableCell>
                                        <TableCell>{dispute.created_on}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default Profile
