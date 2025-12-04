import React, { useEffect, useState } from 'react'
import adminAPI from '../../api/modules/adminAPI';
import { Box } from '@mui/material';
import FullTable from '../../components/FullTable';

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
              <FullTable
                  title="All Institutes"
                  data={institutes}
                  columns={instituteListColumns}
              />
  
          </Box>
      )
}

export default InstituteList
