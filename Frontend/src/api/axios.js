import axios from "axios";
import { store } from "../store/store.js";
import { setAuth, clearUser } from "../redux/slices/userSlice.js";

const axiosInstance = axios.create({
    baseURL: "https://youtube-clone-pi-peach.vercel.app/api/v1",
    withCredentials: true,
});

// Flag to track if a refresh is already in progress
let isRefreshing = false;
// Queue of requests to be executed after token refresh
let refreshSubscribers = [];

// Add a promise to the queue
const subscribeToRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Execute all the queued requests
const onRefreshed = () => {
    refreshSubscribers.forEach(callback => callback());
    refreshSubscribers = [];
};

// Define a function to handle unauthorized access
const handleUnauthorized = () => {
    // Clear user data from Redux store
    store.dispatch(clearUser());
    store.dispatch(setAuth(false));
    
    // Only redirect if not already on the signin page
    if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        // Access token is already sent via httpOnly cookie — nothing to add
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If response is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // If not already refreshing, initiate refresh
            if (!isRefreshing) {
                isRefreshing = true;
                
                try {
                    // Try to refresh the token
                    await axiosInstance.post('/users/refresh-token');
                    
                    // Token refresh successful
                    isRefreshing = false;
                    onRefreshed();
                    
                    // Retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh token fails, log the user out
                    isRefreshing = false;
                    refreshSubscribers = []; // Clear any pending subscribers
                    handleUnauthorized();
                    return Promise.reject(refreshError);
                }
            } else {
                // If already refreshing, wait until refresh is done
                return new Promise((resolve) => {
                    subscribeToRefresh(() => {
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
        }
        
        // For non-401 errors or already retried requests
        return Promise.reject(error);
    }
);

export default axiosInstance;