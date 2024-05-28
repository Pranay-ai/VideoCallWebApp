import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    localName: null,
    localuserRefDB: null,
    remoteName: null,
    remoteuserRefDB: null,
    numberofUsers: 0,
}

const meetSlice = createSlice({
    name: "meet",
    initialState,
    reducers: {
        setLocalName: (state, action) => {
            state.localName = action.payload.localName;
            state.localuserRefDB = action.payload.localuserRefDB;
        },
        setRemoteName: (state, action) => {
            state.remoteName = action.payload.remoteName;
            state.remoteuserRefDB = action.payload.remoteuserRefDB;
        },
        setNumberofUsers: (state, action) => {
            state.numberofUsers = action.payload;
        }
    }
});

export const meetActions = meetSlice.actions;

export default meetSlice.reducer;