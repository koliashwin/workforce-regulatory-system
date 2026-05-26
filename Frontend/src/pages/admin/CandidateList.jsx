import React, { useEffect, useState } from 'react'
import instituteAPI from '../../api/modules/instituteAPI';
import { Box, Typography } from '@mui/material';
import adminAPI from '../../api/modules/adminAPI';
import DataTable from '../../components/DataTable';

const AllCandidateList = () => {
    const [candidates, setCandidates] = useState([]);

    const candidateListColumns = [
        { label: "Name", key: "user_name" },
        { label: "Email", key: "user_email" },
        { label: "Course", key: "course" },
        { label: "Skills", key: "skills" },
        { label: "Institute", key: "institute_name" },
        { label: "Graduate On", key: "passout_year" }
    ]
    useEffect(() => {
        adminAPI.allCandidateList()
            .then(res => setCandidates(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>All Candidates</Typography>
            <DataTable
                data={candidates}
                columns={candidateListColumns}
                emptyText="No Candidates records yet."
            />

        </Box>
    )
}

export default AllCandidateList
