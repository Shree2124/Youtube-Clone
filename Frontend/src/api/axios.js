import axios from "axios";
import { store } from "../store/store.js";  
import { setAuth, setUser, setLoading, setError, clearUser } from "../redux/slices/userSlice.js"

const axiosInstance = axios.create({
    baseURL: "https://youtube-clone-pi-peach.vercel.app/api/v1",
    withCredentials: true,
});
const getCookieToken = (tokenName) => {
    const token = document.cookie.split('; ').find(row => row.startsWith(`${tokenName}=`));
    console.log(tokenName,token);
    return token ? token.split('=')[1] : null;

};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getCookieToken('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getCookieToken('refreshToken');
            console.log(refreshToken);
            try {
                const refreshResponse = await axiosInstance.post('/users/refresh-token', { refreshToken });
                document.cookie = `accessToken=${refreshResponse.data.accessToken}; path=/; secure; SameSite=None`;
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

export default axiosInstance;
