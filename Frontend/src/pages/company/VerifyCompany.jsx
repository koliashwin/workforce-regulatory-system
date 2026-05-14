import React, { useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box, Button, TextField, Typography } from '@mui/material';

const VerifyCompany = () => {
    const [form, setForm] = useState({
        "cin": "",

        // extra fields (need to removed in next version)
        "name": "",
        "address": "",
        "contact_no": "",
        "email": "",
        "verification_status": "string"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await companyAPI.verifyComapny(form);

            const alert_msg = res.data.verified ? "Company is Registered in India" : "Company does not exist in MCA DB";

            alert(alert_msg);
        } catch (error) {
            console.log(error);
            alert("Company Verification Failed");
        }
    }

    return (
        <Box sx={{maxWidth: 500}}>
            <Typography variant='h5' sx={{mb: 2}}>
                Verify Company
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField label="CIN" name='cin' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default VerifyCompany;
