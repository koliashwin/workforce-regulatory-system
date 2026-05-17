// Frontend/src/api/modules/notificationAPI.js

import axiosClient from "../axiosClient";

const notificationAPI = {
    getAll:       (limit = 20) => axiosClient.get(`/notifications?limit=${limit}`),
    getUnreadCount: ()         => axiosClient.get("/notifications/unread_count"),
    markAllRead:  ()           => axiosClient.put("/notifications/mark_all_read"),
    markOneRead:  (id)         => axiosClient.put(`/notifications/${id}/read`),
};

export default notificationAPI;
