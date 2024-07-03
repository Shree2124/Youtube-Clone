import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: false,
    currentUser: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.auth = true
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.auth = false
            state.currentUser = null;
        },
        subscription: (state, action) => {
            if (state.currentUser.subscribedUsers.includes(action.payload)) {
                state.currentUser.subscribedUsers.splice(
                    state.currentUser.subscribedUsers.findIndex(
                        (channelId) => channelId === action.payload
                    ),
                    1
                );
            } else {
                state.currentUser.subscribedUsers.push(action.payload);
            }
        },
    },
});

export const { login, logout, subscription } = userSlice.actions;

export default userSlice.reducer;