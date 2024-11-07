import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios.js';

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

export const fetchUser = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const response = await axiosInstance.get('/users/current-user');
        console.log(response.data);
        dispatch(setUser(response.data.data));
        dispatch(setAuth(true));
        dispatch(setLoading(false))
    } catch (error) {
        console.error('Error fetching user:', error);
        dispatch(setError(error.message));
        dispatch(clearUser());
    }
};

export default authSlice.reducer;
