import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName: null,
    isCaller:false,
    userRefDB:null,
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
    }
}});

export const userInfoActions = UserInfoSlice.actions;
export default UserInfoSlice.reducer;
