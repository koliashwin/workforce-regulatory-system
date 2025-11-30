import axiosClient from "../axiosClient";

const instituteAPI = {
    getCandidateList: () => axiosClient.get("/institute/candidate_list"),
    onboardStudent: (payload) => axiosClient.post("/institute/onboard_students", payload),
    instituteProfile: (id) => axiosClient.get(`/institute/view_profile?institute_id=${id}`)
};

export default instituteAPI;