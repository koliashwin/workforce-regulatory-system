import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layout/PublicLayout'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layout/DashboardLayout'
import Home from '../pages/public/Home'
import Login from '../pages/auth/Login'
import CandidateHome from '../pages/candidate/Home'
import InstituteHome from '../pages/institute/Home'
import CompanyHome from '../pages/company/Home'
import OnboardStudent from '../pages/institute/OnboardStudent'
import CandidateList from '../pages/institute/CandidateList'
import OnboardEmployee from '../pages/company/OnboardEmployee'
import EmployeeList from '../pages/company/EmployeeList'
import CompanyList from '../pages/company/CompanyList'
import RegisterCompany from '../pages/company/RegisterCompany'
import VerifyCompany from '../pages/company/VerifyCompany'
import EmployeeExits from '../pages/company/EmployeeExits'
import JoiningConfirm from '../pages/candidate/JoiningConfirm'
import Profile from '../pages/candidate/Profile'
import ExitConfirm from '../pages/candidate/ExitConfirm'
import DisputesList from '../pages/candidate/DisputesList'

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
                            <Route path='profile' element={<Profile />} />
                            <Route path='joining_confirm' element={<JoiningConfirm />} />
                            <Route path='exit_confirm' element={<ExitConfirm />} />
                            <Route path='disputes' element={<DisputesList />} />
                        </Route>
                        
                        {/* Institute Routes */}
                        <Route path='/institute' element={<ProtectedRoute allowedRoles={['institute']}/>}>
                            <Route path='' element={<InstituteHome />} />
                            <Route path='onboard' element={<OnboardStudent />} />
                            <Route path='candidates' element={<CandidateList />} />
                        </Route>

                        {/* Company Routes */}
                        <Route path='/company' element={<ProtectedRoute allowedRoles={['company']}/>}>
                            <Route path='' element={<CompanyHome />} />
                            <Route path='onboard' element={<OnboardEmployee />} />
                            <Route path='employee_exit' element={<EmployeeExits />} />
                            <Route path='employees' element={<EmployeeList />} />
                            <Route path='company_list' element={<CompanyList />} />
                            <Route path='register' element={<RegisterCompany />} />
                            <Route path='verify' element={<VerifyCompany />} />
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
