import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { createRoomActions } from '../store/Features/createRoomSlice';

export default function CreateRoom() {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const handleClick = (value) => {
        dispatch(createRoomActions.setRoomName(value));
        dispatch(createRoomActions.setRoomId(value));
    }
    const isRoomCreated = useSelector((state) => state.createRoom.isRoomCreated);
    const roomId = useSelector((state) => state.createRoom.roomId);

    // Function to generate a URL with the room ID as a query parameter
    const generateRoomUrl = () => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const meetUrl = new URL('meet', baseUrl);
        meetUrl.searchParams.set('id', roomId);
        return meetUrl.toString();
    }
    

    // Function to copy the room ID to the clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                toast.success("Room ID copied to clipboard!");
            })
            .catch((error) => {
                toast.error("Failed to copy: " + error.message);
            });
    }

    return (
        <div className="startSection">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
            {!isRoomCreated && (
                <>
                    <h1>Create a Room</h1>
                    <div className="ButtonStyle">
                        <input ref={inputRef} type="text" placeholder="Enter Room name" />
                    </div>
                    <div className="ButtonStyle">
                        <button onClick={() => handleClick(inputRef.current.value)}>Submit</button>
                    </div>
                </>
            )}
            {isRoomCreated && (
                <>
                    <h1>Room Created</h1>
                    <h3>Go To <a href={generateRoomUrl()}>Room Link</a></h3>
                    <div className="ButtonStyle">
                        <button onClick={copyToClipboard}>Copy to Clipboard</button>
                    </div>
                </>
            )}
        </div>
    );
}
