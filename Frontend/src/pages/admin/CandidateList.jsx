import React, { useEffect, useState } from 'react'
import instituteAPI from '../../api/modules/instituteAPI';
import { Box } from '@mui/material';
import FullTable from '../../components/FullTable';
import adminAPI from '../../api/modules/adminAPI';

const AllCandidateList = () => {
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
        adminAPI.allCandidateList()
            .then(res => setCandidates(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            {console.log(candidates)}
            <FullTable 
                title='All Candidates'
                data={candidates}
                columns={candidateListColumns}
            />

        </Box>
    )
}

export default AllCandidateList
