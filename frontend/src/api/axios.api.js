import axios from "axios";


const api = axios.create({
    baseURL: process.env.VITE_BASE_URL || 'http://localhost:5000/api/v1/',
    withCredentials: true,
    timeout: 10000,
});

export default api;
