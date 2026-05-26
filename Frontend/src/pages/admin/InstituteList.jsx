import React, { useEffect, useState } from 'react'
import adminAPI from '../../api/modules/adminAPI';
import { Box, Typography } from '@mui/material';
import DataTable from '../../components/DataTable';

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  
      const instituteListColumns = [
          { label: "Institute Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Contact", key: "contact_no" },
          { label: "Code", key: "institute_code" },
          { label: "Address", key: "address" },
          { label: "Verify Status", key: "verification_status" },
      ]
      
      useEffect(() => {
          adminAPI.allInstituteList()
              .then(res => setInstitutes(res.data))
              .catch(err => console.log(err))
      }, []);
  
      return (
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>All Institutes</Typography>
              <DataTable
                //   title="All Institutes"
                  data={institutes}
                  columns={instituteListColumns}
                  emptyText='No Institutes exist yet'
              />
  
          </Box>
      )
}

export default InstituteList
