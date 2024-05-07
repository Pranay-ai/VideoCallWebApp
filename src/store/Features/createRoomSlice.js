import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomName:null,
    roomId:null,
    isRoomCreated:false
}

const createRoomSlice = createSlice({
    name: 'createRoom',
    initialState,
    reducers: {
        setRoomName(state, action) {
            state.roomName = action.payload;
            state.isRoomCreated = true;
        },
        setRoomId(state, action) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charLength = characters.length;

            // Ensure the room name is a valid string and prepare it
            const sanitizedRoomName = action.payload.replace(/[^a-zA-Z0-9]/g, '');
            const maxLength = 16;
            let randomId = '';

            // Extract a portion of the room name to include in the ID
            let roomNamePart = sanitizedRoomName.slice(0, Math.floor(maxLength / 2));
            
            // Generate random characters and build the ID
            for (let i = roomNamePart.length; i < maxLength; i++) {
                randomId += characters.charAt(Math.floor(Math.random() * charLength));
            }

            // Shuffle roomNamePart with randomId to ensure randomness and limit to maxLength
            randomId = (roomNamePart + randomId).split('').sort(() => 0.5 - Math.random()).join('');
            state.roomId = randomId;
        }
    }
});

export const createRoomActions = createRoomSlice.actions;
export default createRoomSlice.reducer;