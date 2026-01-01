import api from "./axios.api.js";

export const sendMessage = (messagesData) => {
    api.post('messages/send', messagesData);
}

export const markMessageRead =  (userId) => {
    api.put(`messages/read/${userId}`);
}

export const getMessages = () => {
    api.get('messages/list');
}
