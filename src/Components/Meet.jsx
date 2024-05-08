import { useSelector,useDispatch } from "react-redux"
import { setUserName } from "../store/Features/meetSlice";
import { push, child, onValue, onDisconnect, off } from 'firebase/database';
import firepadRef, { connectedRef } from "../server/firebase"
import { useRef,useEffect } from "react";

export default function Meet() {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const isUserName = useSelector((state) => state.meet.isUserName);
    const userName = useSelector((state) => state.meet.userName);
    useEffect(() => {
        const participantsRef = child(firepadRef, 'participants');
        console.log(participantsRef);
        let checkConnection; // Declare checkConnection outside the conditional block
    
        if (isUserName) {
            checkConnection = onValue(connectedRef, snap => {
                if (snap.val() === true) {
                    console.log('connected');
    
                    const defaultPrefs = {
                        audio: false,
                        video: false,
                        screen: false
                    };
                    const userRef = push(participantsRef, { userName, preferences: defaultPrefs });
                    onDisconnect(userRef).remove();
                } else {
                    console.log('not connected');
                }
            });
        }
    
        // Cleanup function to unsubscribe from the event listener
        return () => {
            if (checkConnection) {
                off(connectedRef, 'value', checkConnection);
            }
        };
    }, [isUserName]); // Ensure to include all dependencies in the dependency array
    




    return (
    <>
    {!isUserName &&   <div className="startSection">
            <h1>Enter Your User Name</h1>
            <div className="ButtonStyle">
                <input ref={inputRef} type="text" placeholder="Enter Your Name" />
            </div>
            <div className="ButtonStyle">
                <button onClick={()=>dispatch(setUserName(inputRef.current.value))}>Submit</button>
            </div>
        </div>
        
    }
    {isUserName && <div className="startSection">
            <h1>Welcome {userName}</h1>
        </div>
    }
       
    </>

    )



}
