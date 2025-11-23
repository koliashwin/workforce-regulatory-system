import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layout/PublicLayout'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layout/DashboardLayout'
import Home from '../pages/public/Home'
import Login from '../pages/auth/Login'
import CandidateHome from '../pages/candidate/Home'
import InstituteHome from '../pages/institute/Home'
import CompanyHome from '../pages/company/Home'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Pages */}
                <Route element={<PublicLayout />}>
                    <Route path='/login' element={<Login />} />
                    <Route path='/' element={<Home />} />
                </Route>

                {/* Protected Pages */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>

                        {/* Candidate Routes */}
                        <Route path='/candidate' element={<ProtectedRoute allowedRoles={['candidate']}/>}>
                            <Route path='' element={<CandidateHome />} />
                        </Route>
                        
                        {/* Institute Routes */}
                        <Route path='/institute' element={<ProtectedRoute allowedRoles={['institute']}/>}>
                            <Route path='' element={<InstituteHome />} />
                        </Route>

                        {/* Company Routes */}
                        <Route path='/company' element={<ProtectedRoute allowedRoles={['company']}/>}>
                            <Route path='' element={<CompanyHome />} />
                        </Route>

                        {/* <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
                            <Route path='/admin' element={<AdminHome />} />
                        </Route> */}

                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
