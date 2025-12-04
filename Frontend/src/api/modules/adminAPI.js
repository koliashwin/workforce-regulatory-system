import axiosClient from "../axiosClient";

const adminAPI = {
    allEmployeeHistory: () => axiosClient.get("/admin/employee_list"),
    allCompanyList: () => axiosClient.get("/admin/company_list"),
    allCandidateList: () => axiosClient.get("/admin/candidate_list"),
    allInstituteList: () => axiosClient.get("/admin/institute_list")
}

export default adminAPI;