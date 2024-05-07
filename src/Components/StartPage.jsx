import { useDispatch } from "react-redux";
import { uiActions } from "../store/Features/uiSlice";
import { useSelector } from "react-redux";
export default function StartPage() {
    const dispatch = useDispatch();

    const handleClick = (value) => {
        dispatch(uiActions.setOptionSelected(value));
    }
  return (
    <div className="startSection">
  
        <h1>Start or Join a Meeting</h1>
        <div className="ButtonStyle">
            <button onClick={()=>handleClick("create-room")}>Create a Room</button>
        </div>
        <div className="ButtonStyle">
            <button onClick={()=>handleClick("join-room")}>Join a Room</button>
        </div>

    </div>
  );
}