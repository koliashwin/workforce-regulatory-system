import React, { useEffect, useState } from 'react'
import instituteAPI from '../../api/modules/instituteAPI';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);

    const candidateListColumns = [
        { label: "Name", key: "user_name" },
        { label: "Email", key: "user_email" },
        { label: "Course", key: "course" },
        { label: "Skills", key: "skills" },
        { label: "Institute", key: "institute_name" },
        { label: "Graduate On", key: "passout_year"}
    ]
    useEffect(() => {
        instituteAPI.getCandidateList()
            .then(res => setCandidates(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>All Candidates</Typography>
            <DataTable 
                // title='All Candidates'
                data={candidates}
                columns={candidateListColumns}
                emptyText='No candidates exist yet. you can initiate onboarding process in onbording section'
            />

        </Box>
    )
}

export default CandidateList
