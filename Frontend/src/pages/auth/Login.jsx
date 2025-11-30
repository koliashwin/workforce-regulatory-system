import { Box, Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const redirectMap = {
  candidate: "/candidate",
  institute: "/institute",
  company: "/company",
  admin: "/admin",
};

const Login = () => {
    const {user, login} = useAuth();
    const navigate = useNavigate();

    // check if user alredy exit 
    // if yes then navigate to relevent landing page
    useEffect(() => {
        if (user?.role) {
            navigate(redirectMap[user.role])
        }
    }, [user, navigate]);

    // verify login credential and update the localStorage
    const handleLogin = () => {
        // temporary logic
        const userData = {role: "institute", user_id: "1"}
        
        login(userData)

    }

    return (
        <Box>
            <Typography variant='h2'>Login page</Typography>
            <Button onClick={handleLogin}>Login as Candidate</Button>
        </Box>
    )
}

export default Login
