import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    RoomId:null,
    isRoomJoined:false,
    errorJoiningRoom:null,
}

const joinSlice = createSlice({
    name: 'join',
    initialState,
    reducers: {
        setRoomId(state, action) {
            state.RoomId = action.payload;
            state.isRoomJoined = true;
        },
        setErrorJoiningRoom(state, action) {
            state.errorJoiningRoom = action.payload;
        }
    }
});

export const joinActions = joinSlice.actions;

export default joinSlice.reducer;

