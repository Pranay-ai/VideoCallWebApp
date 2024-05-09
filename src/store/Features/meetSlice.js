import { createSlice} from "@reduxjs/toolkit";
import { set } from "firebase/database";

const initialState = {
    isUserName:false,
    userName:null,
    participants:null,
    userKey:null
}


const meetSlice = createSlice({
    name: "meet",
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.isUserName = true;
            state.userName = action.payload;
        },
        setParticipants: (state, action) => {
            state.participants = action.payload;
        },
        setUserKey: (state, action) => {
            state.userKey = action.payload;
        }

    }
})


export const { setUserName,setParticipants, setUserKey } = meetSlice.actions;
export default meetSlice.reducer;