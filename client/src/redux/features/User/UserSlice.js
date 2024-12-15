import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name: 'User',
    initialState: { loggedInUser: null ,
      otherUsers:null,
      selectedChatUser:null
    },
    reducers: {
      login: (state, action) => {
        state.loggedInUser = action.payload;
      },
      logout: (state) => {
        state.loggedInUser = null;
        state.otherUsers = null;
        state.selectedChatUser = null
      },
      setOtherUsers: (state , action) => {
        state.otherUsers = action.payload;
      },
      setSelectedChatUser: (state , action) => {
        state.selectedChatUser = action.payload;
      },
    },
  });
  
  export const { login, logout , setOtherUsers , setSelectedChatUser} = UserSlice.actions;
  
  export default UserSlice.reducer;