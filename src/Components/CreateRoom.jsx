import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firepadRef from '../server/firebase';
import { child, onValue, set, push, off } from 'firebase/database';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { createRoomActions } from '../store/Features/createRoomSlice';
import { userInfoActions } from '../store/Features/UserInfoSlice';
import { NavLink } from "react-router-dom";

export default function CreateRoom() {
    const inputRef = useRef();
    const userNameRef = useRef();
    const dispatch = useDispatch();
    const handleClick = (value) => {
        dispatch(createRoomActions.setRoomName(value));
        dispatch(createRoomActions.setRoomId(value));
        dispatch(userInfoActions.setUserInfo({
            userName: userNameRef.current.value,
            isCaller: true,
        }));
    }
    const isRoomCreated = useSelector((state) => state.createRoom.isRoomCreated);
    const roomId = useSelector((state) => state.createRoom.roomId);
    const roomName = useSelector((state) => state.createRoom.roomName);
    const userName = useSelector((state) => state.userInfo.userName);

    useEffect(() => {
        if (isRoomCreated && roomId && roomName && userName) {
            set(child(firepadRef, 'rooms/' + roomId), {
                roomName: roomName,
            });
            // Pushing to create a new entry with a unique key
            const newUserRef = push(child(firepadRef, 'rooms/' + roomId + '/users'));
            dispatch(userInfoActions.setUserRefDB(newUserRef.key));
            set(newUserRef, {
                userName: userName,
                isCaller: true,
            });
        }
    }, [isRoomCreated, roomId, roomName, userName, firepadRef]);






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
                        <input ref={userNameRef} type="text" placeholder="Enter User Name" />
                    </div>
                    <div className="ButtonStyle">
                        <button onClick={() => handleClick(inputRef.current.value)}>Submit</button>
                    </div>
                </>
            )}
            {isRoomCreated && (
                <>
                    <h1>Room Created</h1>
                    <div className="ButtonStyle">
                        <button onClick={copyToClipboard}>Copy Room ID to Clipboard</button>
                    </div>
                    <div className="ButtonStyle">
                        <NavLink to={"/meet"} className="button" >Join Meet</NavLink>
                    </div>
                </>
            )}
        </div>
    );
}
