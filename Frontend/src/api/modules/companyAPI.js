import axiosClient from "../axiosClient";

const companyAPI = {
    registerCompany : (payload) => axiosClient.post("/company/register", payload),
    companyList : () => axiosClient.get("/company/company_list"),       // this endpoint should be in admin
    employeeList : () => axiosClient.get(`/company/employee_list`),     // this endpoint should be in admin
    verifyComapny : (payload) => axiosClient.post("/company/verify_company", payload),
    onboardEmployee : (payload) => axiosClient.post("/company/onboard_employee", payload),
    employeeExits : (payload) => axiosClient.post("/company/employee_exit", payload),
    companyProfile : () => axiosClient.get(`/company/view_profile`)
};

export default companyAPI;