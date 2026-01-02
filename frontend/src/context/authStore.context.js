import {create} from 'zustand';
import {refreshToken, loginUser, logoutUser} from '../api/auth.api.js';

const useAuthStore = create((set)=> ({
    user: null,
    isAuth: false,
    loading: true,

    login : async (data) => {
        const res = loginUser(data);
        set({user: res.data.user, isAuth: true, loading: false});
    },

    checkAuth: async () => {
        try {
            const res  = refreshToken();
            set({user: res.user, isAuth: true, loading: false});
        } catch (error) {
            set({user: null, isAuth: false, loading: false});
        }
    },

    logout: async () => {
        logoutUser();
        set({user: null, isAuth: false, loading: false});
    }
}));


export default useAuthStore

