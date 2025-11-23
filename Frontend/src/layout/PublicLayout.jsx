import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
    return (
        <Box>
            <AppBar position='fixed'>
                <Toolbar>
                    <Typography variant='h6' sx={{flexGrow: 1}}>
                        Scam Regulatory System
                    </Typography>
                    <Button color='inherit' href='/login'>Login</Button>
                </Toolbar>
            </AppBar>

            <Box sx={{mt: 8, p: 3}}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default PublicLayout
