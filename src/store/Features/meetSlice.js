import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    isUserName:false,
    userName:null
}


const meetSlice = createSlice({
    name: "meet",
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.isUserName = true;
            state.userName = action.payload;
        }
    }
})


export const { setUserName } = meetSlice.actions;
export default meetSlice.reducer;