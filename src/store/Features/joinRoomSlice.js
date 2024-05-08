import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    joiningRoom: false,
    roomId: null
}

const joinRoomSlice= createSlice({
    name: "joinRoom",
    initialState,
    reducers: {
        setJoiningRoom: (state) => {
            state.joiningRoom = true;
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        }
    }
})

export const joinRoomActions = joinRoomSlice.actions;
export default joinRoomSlice.reducer;

