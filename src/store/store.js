import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./Features/uiSlice"
import createRoomReducer from "./Features/createRoomSlice"
import joinRoomReducer from "./Features/joinRoomSlice";

const store= configureStore({
    reducer:{
        ui: uiReducer,
        createRoom: createRoomReducer,
        joinRoom: joinRoomReducer
    }
})

export default store;