import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isOptionSelected: false,
    valueOption:null
}

const uiSlice= createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setOptionSelected(state, action) {
            state.isOptionSelected = true;
            state.valueOption = action.payload;
        }
    }
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;