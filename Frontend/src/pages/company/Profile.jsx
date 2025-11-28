import { useEffect, useState } from "react";
import companyAPI from "../../api/modules/companyAPI";
import { Box, Card, CardContent, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const Profile = () =>  {
  const [details, setDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // Fetch all data
  useEffect(() => {
    companyAPI.companyList().then((res) => setDetails(res.data));
    companyAPI.employeeList().then((res) => setEmployees(res.data));
  }, []);

  if (!details) return <Typography>Loading company profile...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Company Profile
      </Typography>

      {/* Company Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Company Information</Typography>
          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <b>Name:</b> {details.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Email:</b> {details.email}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <b>CIN:</b> {details.cin}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Contact:</b> {details.contact_no}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <b>Address:</b> {details.address}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <b>Verification Status:</b> {details.verification_status}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Employee List</Typography>
          <Divider sx={{ my: 1 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Exit Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.user_name}</TableCell>
                  <TableCell>{emp.emp_designation}</TableCell>
                  <TableCell>{emp.joining_date}</TableCell>
                  <TableCell>{emp.exit_date || "Present"}</TableCell>
                  <TableCell>{emp.employment_status}</TableCell>
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

          {disputes.length === 0 ? (
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
                {disputes.map((d, index) => (
                  <TableRow key={index}>
                    <TableCell>{d[1]} (ID: {d[0]})</TableCell>
                    <TableCell>{d[3]} (ID: {d[2]})</TableCell>
                    <TableCell>{d[5]}</TableCell>
                    <TableCell>{d[7]}</TableCell>
                    <TableCell>
                      {new Date(d[8]).toLocaleString()}
                    </TableCell>
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