import axios from "axios";
import { store } from "../store/store.js";  
import { setAuth, setUser, setLoading, setError, clearUser } from "../redux/slices/userSlice.js"

const axios = axios.create({
    baseURL: "https://youtube-clone-pi-peach.vercel.app/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
const getCookieToken = (tokenName) => {
    const token = document.cookie.split('; ').find(row => row.startsWith(`${tokenName}=`));
    return token ? token.split('=')[1] : null;
};

axios.interceptors.request.use(
    (config) => {
        const accessToken = getCookieToken('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getCookieToken('refreshToken');

            try {
                const refreshResponse = await axios.post('/users/refresh-token', { refreshToken });
                document.cookie = `accessToken=${refreshResponse.data.accessToken}; path=/; secure; SameSite=Lax`;
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                store.dispatch(clearUser());
                store.dispatch(setAuth(false));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
