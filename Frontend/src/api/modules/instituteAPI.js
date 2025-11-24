import axiosClient from "../axiosClient";

const instituteAPI = {
    getStudents: () => axiosClient.get("/institute/candidate_list"),
    addStudents: (payload) => axiosClient.post("/institute/onboard_students", payload)
};

export default instituteAPI;