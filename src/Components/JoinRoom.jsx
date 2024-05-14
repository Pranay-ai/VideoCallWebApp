import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinActions } from "../store/Features/joinSlice";
import { userInfoActions } from "../store/Features/UserInfoSlice";
import firepadRef from '../server/firebase';
import { child, onValue, set, push, off, get } from 'firebase/database';
import { NavLink } from "react-router-dom";

export default function JoinRoom() {
    const inputRef = useRef();
    const UserNameRef = useRef();
    const dispatch = useDispatch();
    const isRoomJoined = useSelector((state) => state.join.isRoomJoined);
    const userName = useSelector((state) => state.userInfo.userName);
    const roomId = useSelector((state) => state.join.RoomId);
    const ErrorJoiningRoom = useSelector((state) => state.join.errorJoiningRoom);

    function handleClick() {
        dispatch(joinActions.setRoomId(inputRef.current.value));
        dispatch(userInfoActions.setUserInfo({
            userName: UserNameRef.current.value,
            isCaller: false,
        }));
    }

    useEffect(() => {
        console.log("UseEffect One Running")
        if (roomId) {
            console.log("RoomId Exists")
            const roomRef = child(firepadRef, 'rooms/' + roomId);
            const userRef = child(firepadRef, 'rooms/' + roomId + '/users');
            const checkForUsers = async () => {
                try {
                    const snapshot = await get(userRef);
                    const data = snapshot.val();
                    console.log(data);

                    if (data && Object.keys(data).length >= 2) {
                        dispatch(joinActions.setErrorJoiningRoom("error"));
                    } else {
                        dispatch(joinActions.setErrorJoiningRoom("no-error"));
                    }
                } catch (error) {
                    console.error("Error checking users:", error);
                }
            };

            checkForUsers();
        }
    }, [roomId])

    useEffect(() => {
        console.log("UseEffect Two Running")
        console.log("ErrorJoiningRoom", ErrorJoiningRoom)
        if (ErrorJoiningRoom === "no-error" && roomId && userName) {
            const newUserRef = push(child(firepadRef, 'rooms/' + roomId + '/users'));
            dispatch(userInfoActions.setUserRefDB(newUserRef.key));
            set(newUserRef, {
                userName: userName,
                isCaller: false,
            });
        }
    }, [roomId, userName, ErrorJoiningRoom]);

    return (
        <div className="startSection">
            {!isRoomJoined &&
                <>
                    <h1>Join a Room</h1>
                    <div className="ButtonStyle">
                        <input ref={inputRef} type="text" placeholder="Enter Room ID" />
                    </div>
                    <div className="ButtonStyle">
                        <input ref={UserNameRef} type="text" placeholder="Enter User Name" />
                    </div>
                    <div className="ButtonStyle">
                        <button onClick={handleClick}>Submit</button>
                    </div>
                </>
            }
            {isRoomJoined &&
                <>
                    <h2>Joining Room</h2>
                    <div className="ButtonStyle">
                        <NavLink to={"/meet"} className="button">Join Meet</NavLink>
                    </div>

                </>
            }
            {ErrorJoiningRoom === "error" &&
                <>
                    <h2>Error Joining Room: Room is Full</h2>
                </>
            }
        </div>
    );
}
