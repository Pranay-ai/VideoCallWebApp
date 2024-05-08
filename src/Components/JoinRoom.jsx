import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { joinRoomActions } from "../store/Features/joinRoomSlice";
export default function JoinRoom() {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const isJoiningRoom = useSelector((state) => state.joinRoom.joiningRoom);
    const roomId = useSelector((state) => state.joinRoom.roomId);

    function handleClick(value){
        dispatch(joinRoomActions.setJoiningRoom());
        dispatch(joinRoomActions.setRoomId(value));
    }

    const generateRoomUrl = () => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const meetUrl = new URL('meet', baseUrl);
        meetUrl.searchParams.set('id', roomId);
        return meetUrl.toString();
    }

    return (

        <div className="startSection">
            {!isJoiningRoom &&             
            <>
                <h1>Join a Room</h1>
                <div className="ButtonStyle">
                    <input ref={inputRef} type="text" placeholder="Enter Room ID" />
                </div>
                <div className="ButtonStyle">
                    <button onClick={()=>handleClick(inputRef.current.value)}>Submit</button>
                </div>
            </>
            }
            {isJoiningRoom &&
            <>
                <h3>Go To <a href={generateRoomUrl()}>Room Link</a></h3>
            </>
            }
        </div>
    )
}