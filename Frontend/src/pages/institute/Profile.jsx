import { useEffect, useState } from "react";
import { Box, Card, CardContent, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import instituteAPI from "../../api/modules/instituteAPI";

const Profile = () => {
    const [profile, setProfile] = useState(null);

    // Fetch all data
    useEffect(() => {
        instituteAPI.instituteProfile(1)
            .then(res => {setProfile(res.data)})
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

            {/* Company Information */}
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

            {/* Employee List */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Alumni List</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Passout</TableCell>
                                <TableCell>Skills</TableCell>
                                <TableCell>Workeing at</TableCell>
                                <TableCell>Designation</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {profile.institute_students.map((student, index) => (
                                <TableRow key={student.user_id}>
                                    <TableCell>{student.student_name}</TableCell>
                                    <TableCell>{student.student_contact}</TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell>{student.passout_year}</TableCell>
                                    <TableCell>{student.skills}</TableCell>
                                    <TableCell>{student.company_name || "N/A"}</TableCell>
                                    <TableCell>{student.designation || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Disputes List */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Disputes History</Typography>
                    <Divider sx={{ my: 1 }} />

                    {profile.dispute_history.length === 0 ? (
                        <Typography>No disputes found</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Raised By</TableCell>
                                    <TableCell>Against</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created At</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {profile.dispute_history.map((d, index) => (
                                    <TableRow key={d.dispute_id}>
                                        <TableCell>{d.raised_by_type}</TableCell>
                                        <TableCell>{d.raised_against_type}</TableCell>
                                        <TableCell>{d.topic}</TableCell>
                                        <TableCell>{d.status}</TableCell>
                                        <TableCell>{d.created_on}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default Profile;