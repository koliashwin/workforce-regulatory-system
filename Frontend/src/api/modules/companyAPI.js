import axiosClient from "../axiosClient";

const companyAPI = {
    // Profile
    companyProfile:     ()     => axiosClient.get("/company/view_profile"),
    employeeList:       ()     => axiosClient.get("/company/employee_list"),

    // Company registration
    registerCompany:    (data) => axiosClient.post("/company/register",          data),
    verifyCompany:      (data) => axiosClient.post("/company/verify_company",    data),

    // Joining flow
    joiningInitiate:    (data) => axiosClient.post("/company/joining_initiate",  data),

    // Exit flow
    exitInitiate:       (data) => axiosClient.post("/company/exit_initiate",     data),
};

export default companyAPI;