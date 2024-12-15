import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice(
    {
        name: "Socket",
        initialState: {
            socket: null,
            onlineUsers: null
        },
        reducers: {
            setSocket: (state, action) => {
                state.socket = action.payload.socket;
            },
            setOnlineUsers: (state, action) => {
                state.onlineUsers = action.payload.users;
            },
            disconnectSocket: (state) => {
                state.socket = null;
                state.onlineUsers = null;    }
    }}
)

export const { setSocket, setOnlineUsers , disconnect } = socketSlice.actions;

export default socketSlice.reducer;