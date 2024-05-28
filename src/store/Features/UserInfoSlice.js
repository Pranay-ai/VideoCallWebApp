import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName: null,
    isCaller:false,
    userRefDB:null,
    userLeft:false,
};

const UserInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userName = action.payload.userName;
            state.isCaller = action.payload.isCaller;
        },
        setUserRefDB: (state, action) => {
            state.userRefDB = action.payload;
    },
        setisCaller: (state, action) => {
            state.isCaller = action.payload;
        },
}});

export const userInfoActions = UserInfoSlice.actions;
export default UserInfoSlice.reducer;
