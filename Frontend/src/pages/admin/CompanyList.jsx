import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import FullTable from '../../components/FullTable';
import adminAPI from '../../api/modules/adminAPI';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    const companyListColumns = [
        { label: "Company Name", key: "name" },
        { label: "Company Email", key: "email" },
        { label: "Contact", key: "contact" },
        { label: "CIN", key: "cin" },
        { label: "Address", key: "address" },
        { label: "Verify Status", key: "verification_status" },
    ]
    
    useEffect(() => {
        adminAPI.allCompanyList()
            .then(res => setCompanies(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <FullTable
                title="All Comapanies"
                data={companies}
                columns={companyListColumns}
            />

        </Box>
    )
}

export default CompanyList
