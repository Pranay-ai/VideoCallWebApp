import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./Features/uiSlice"
import createRoomReducer from "./Features/createRoomSlice"

const store= configureStore({
    reducer:{
        ui: uiReducer,
        createRoom: createRoomReducer
    }
})

export default store;