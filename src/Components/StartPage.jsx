import { useDispatch } from "react-redux";
import { uiActions } from "../store/Features/uiSlice";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


export default function StartPage() {


    return (
        <div className="startSection">
            <h1>Start or Join a Meeting</h1>
            <div className="ButtonStyle">
                <NavLink to={"create-room"} className="button" >Create a Room</NavLink>
            </div>
            <div className="ButtonStyle">
                <NavLink to={"join-room"} className="button">Join a Room</NavLink>
            </div>
        </div>
    );
}
