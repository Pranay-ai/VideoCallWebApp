import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./Features/uiSlice"
import createRoomReducer from "./Features/createRoomSlice"
import UserInfoReducer from "./Features/UserInfoSlice"
import JoinReducer from "./Features/joinSlice"
import meetReducer from "./Features/meetSlice"

const store= configureStore({
    reducer:{
        ui: uiReducer,
        createRoom: createRoomReducer,
        userInfo: UserInfoReducer,
        join: JoinReducer,
        meet: meetReducer,
    }
})

export default store;