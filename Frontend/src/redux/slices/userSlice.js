import { createSlice } from '@reduxjs/toolkit';
import axios from '../../api/axios.js';

const initialState = {
    auth: false,
    user: {},
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action)=>{
            state.auth = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state) => {
            state.loading = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
        },

    },
});

export const { setUser, setError, setLoading, clearUser, setAuth } = authSlice.actions;

const getCookieToken = (tokenName) => {
    const token = document.cookie.split('; ').find(row => row.startsWith(`${tokenName}=`));
    // console.log(document.cookie);
    
    return token ? token.split('=')[1] : null;
};

export const fetchUser = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        // console.log(getCookieToken('accessToken'));
        
        const response = await axiosInstance.get('/users/current-user', {
            headers: {
                Authorization: `Bearer ${getCookieToken('accessToken')}`,
            },
        });

        console.log('User fetched successfully:', response.data);

        dispatch(setUser(response.data.data));
        dispatch(setAuth(true))
    } catch (error) {
        console.error('Error fetching user:', error);

        if (error.response?.status === 401) {
            try {
                const refreshToken = getCookieToken('refreshToken');
                const refreshResponse = await axiosInstance.post('/users/refresh-token', {
                    refreshToken,
                });
                document.cookie = `accessToken=${refreshResponse.data.accessToken}; path=/; secure; SameSite=Lax`;
                dispatch(fetchUser());
                dispatch(setAuth(false))
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                dispatch(clearUser());
                dispatch(setAuth(false))
            }
        } else {
            dispatch(setError(error.message));
            dispatch(setAuth(false))
        }
    }
};

export default authSlice.reducer;
