import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./Features/uiSlice"
import createRoomReducer from "./Features/createRoomSlice"
import UserInfoReducer from "./Features/UserInfoSlice"
import JoinReducer from "./Features/joinSlice"

const store= configureStore({
    reducer:{
        ui: uiReducer,
        createRoom: createRoomReducer,
        userInfo: UserInfoReducer,
        join: JoinReducer,
    }
})

export default store;