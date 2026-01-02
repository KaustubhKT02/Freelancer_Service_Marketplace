import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/',
    withCredentials: true,
    timeout: 10000,
});

export default api;
