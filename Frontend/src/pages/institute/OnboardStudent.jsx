import React, { useState } from 'react'
import instituteAPI from '../../api/modules/instituteAPI';
import { Box, Button, TextField, Typography } from '@mui/material';

const OnboardStudent = () => {
    const [form, setFrom] = useState({
        "role_id": 100,
        "email": "",
        "password_hash": "Abc@123",      // TODO: shoud generate at backend
        "name": "",
        "contact_no": "",
        "dob": "",
        "institute_id": 1,               // TODO: should be read from local storage
        "course": "",
        "passout_year": "",
        "skills": "",

        // followin are the extra fields 
        // kept just to bypass pydantic schema validation
        "created_on": "string",
        "updated_on": "string",
        "last_login": "string",
        "user_id": 0,
        "institute_name": "string",
        "institute_email": "clg1@mail.com",
        "institute_code": 0 
    });

    const handleChange = (e) => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await instituteAPI.onboardStudent(form);
            console.log("Student onboarded : ", res.data);
            console.log("Form Data : ", form);
            alert("Student Created successfully");
        } catch (error) {
            console.log(error);
            alert("Failed to onboard Student");
        }
    }

    return (
        <Box sx={{maxWidth: 500}}>
            <Typography variant='h5' sx={{mb: 2}}>
                Onboard Student
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField label="Full Name" name='name' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Email" name='email' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Contact No." name='contact_no' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="DOB (YYYY-MM-DD)" name='dob' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Course" name='course' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Passout Year (YYYY-MM-DD)" name='passout_year' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Skills" name='skills' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default OnboardStudent
