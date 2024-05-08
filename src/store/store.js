import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./Features/uiSlice"
import createRoomReducer from "./Features/createRoomSlice"
import joinRoomReducer from "./Features/joinRoomSlice";
import meetReducer from "./Features/meetSlice"

const store= configureStore({
    reducer:{
        ui: uiReducer,
        createRoom: createRoomReducer,
        joinRoom: joinRoomReducer,
        meet: meetReducer
    }
})

export default store;