import api from "./axios.api.js";

export const getnotification = async () => {
    const response = await api.get('notification/');
    return response.data;
}

export const markAsRead = async (userId, notificationId) => {
    const response = await api.post(`notification/read/${userId}`, { notificationId });
    return response.data;
}

export const markAllAsRead = async () => {
    const response = await api.post('notification/read-all');
    return response.data;
}

