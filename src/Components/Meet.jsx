import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { child, onValue, set, push, off, remove, get } from "firebase/database";
import { userInfoActions } from "../store/Features/UserInfoSlice";
import { meetActions } from "../store/Features/meetSlice";
import firepadRef from "../server/firebase";

export default function Meet() {
  const dispatch = useDispatch();
  const userRefDB = useSelector((state) => state.userInfo.userRefDB);
  const isCaller = useSelector((state) => state.userInfo.isCaller);
  const numberofUsers = useSelector((state) => state.meet.numberofUsers);
  const roomRef = isCaller
    ? useSelector((state) => state.createRoom.roomId)
    : useSelector((state) => state.join.RoomId);
  const localName = useSelector((state) => state.meet.localName);
  const remoteName = useSelector((state) => state.meet.remoteName);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);

  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      throw error;
    }
  }, []);

  useEffect(()=>{
    const userRef = child(firepadRef, `rooms/${roomRef}/users/${userRefDB}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists() 
        && snapshot.val().isCaller) {
        dispatch(userInfoActions.setisCaller(true));
      }
    });

    return () => {
      off(userRef);
    };
    
  })

  const initWebRTC = useCallback(async () => {
    try {
      const stream = await getUserMedia();
      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        pc.current.addTrack(track, stream);
      });

      pc.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offerRef = child(firepadRef, `rooms/${roomRef}/offers`);
      const answerRef = child(firepadRef, `rooms/${roomRef}/answers`);
      const candidateRef = child(firepadRef, `rooms/${roomRef}/candidates`);

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          push(candidateRef, { candidate: event.candidate.toJSON(), userRefDB });
        }
      };

      if (isCaller) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        set(offerRef, { offer: pc.current.localDescription.toJSON(), userRefDB });
      }

      onValue(offerRef, async (snapshot) => {
        if (!isCaller && snapshot.exists() && !pc.current.currentRemoteDescription) {
          const data = snapshot.val();
          if (data.userRefDB !== userRefDB) {
            const offerDescription = new RTCSessionDescription(data.offer);
            await pc.current.setRemoteDescription(offerDescription);
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            set(answerRef, { answer: pc.current.localDescription.toJSON(), userRefDB });
          }
        }
      });

      onValue(candidateRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().userRefDB === userRefDB) return;
          const candidate = new RTCIceCandidate(childSnapshot.val().candidate);
          pc.current.addIceCandidate(candidate).catch((e) => console.error("Error adding ICE candidate:", e));
        });
      });

      onValue(answerRef, (snapshot) => {
        if (snapshot.exists() && !pc.current.currentRemoteDescription) {
          const data = snapshot.val();
          if (data.userRefDB !== userRefDB) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.current.setRemoteDescription(answerDescription);
          }
        }
      });
    } catch (error) {
      console.error("Error initializing WebRTC: ", error);
    }
  }, [getUserMedia, userRefDB, isCaller, roomRef, numberofUsers]);

  useEffect(() => {
    if (isCaller || roomRef) {
      initWebRTC();
    }

    // const handleLeave = () => {
    //   const offerRef = child(firepadRef, `rooms/${roomRef}/offers`);
    //   const answerRef = child(firepadRef, `rooms/${roomRef}/answers`);
    //   const candidateRef = child(firepadRef, `rooms/${roomRef}/candidates`);
    //   console.log("Handling user leave...");
    //   try {
    //     if (numberofUsers === 1) {
    //       remove(child(firepadRef, `rooms/${roomRef}`));
    //       return;
    //     }
    //     const path = `rooms/${roomRef}/users/${userRefDB}`;
    //     remove(child(firepadRef, path));
    //     const remainingUsers = get(child(firepadRef, `rooms/${roomRef}/users`));
    //     // dispatch(userInfoActions.setisCaller(true));
    //     if (remainingUsers.exists()) {
    //       console.log("Remaining Users: ", remainingUsers.val());
    //       const users = Object.keys(remainingUsers.val());
    //       console.log("Setting User as Caller: ", users[0]);
    //       set(child(firepadRef, `rooms/${roomRef}/users/${users[0]}/isCaller`), true);
    //     }
    //     remove(candidateRef);
    //     remove(offerRef);
    //     remove(answerRef);
    //   } catch (error) {
    //     console.error("Error during handleLeave: ", error);
    //   }
    // };
    const handleLeave = async () => {
      try {
        const roomPath = `rooms/${roomRef}`;
        const offerRef = child(firepadRef, `${roomPath}/offers`);
        const answerRef = child(firepadRef, `${roomPath}/answers`);
        const candidateRef = child(firepadRef, `${roomPath}/candidates`);
        const userRef = child(firepadRef, `${roomPath}/users/${userRefDB}`);
  
        // Remove the user-specific references
        console.log("Removing user reference...");
        await remove(userRef);
  
        // Check the remaining users after removing the current user
        const remainingUsersSnapshot = await get(child(firepadRef, `${roomPath}/users`));
        const remainingUsers = remainingUsersSnapshot.exists() ? remainingUsersSnapshot.val() : {};
        const userCount = Object.keys(remainingUsers).length;
  
        if (userCount === 0) {
          // If no users are left, remove the entire room
          console.log("No users left, removing entire room...");
          await remove(child(firepadRef, roomPath));
        } else {
          // Update isCaller for the first remaining user if there are still users left
          console.log("Users remaining, updating caller...");
          const remainingUserKeys = Object.keys(remainingUsers);
          await set(child(firepadRef, `${roomPath}/users/${remainingUserKeys[0]}/isCaller`), true);
        }
  
        // Clean up offers, answers, and candidates
        console.log("Removing offer references...");
        await remove(offerRef);
        console.log("Removing answer references...");
        await remove(answerRef);
        console.log("Removing candidate references...");
        await remove(candidateRef);
  
        console.log("All references removed successfully");
  
      } catch (error) {
        console.error("Error during handleLeave: ", error);
      }
    };
  
    const handleUnload = async (event) => {
      event.preventDefault();
      console.log("Handling user leave...");
      await handleLeave();
      console.log("User left");
      event.returnValue = ""; // Ensure the event is not blocked
    };
  
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      off(child(firepadRef, `rooms/${roomRef}/offers`));
      off(child(firepadRef, `rooms/${roomRef}/answers`));
      off(child(firepadRef, `rooms/${roomRef}/candidates`));
    };
  }, [isCaller, roomRef, userRefDB,
    
    initWebRTC, numberofUsers, dispatch]);

  useEffect(() => {
    const participantRef = child(firepadRef, `rooms/${roomRef}/users`);
    onValue(participantRef, (snapshot) => {
      if (snapshot.exists() && Object.keys(snapshot.val()).length === 2) {
        dispatch(meetActions.setNumberofUsers(2));
        console.log("Both users are connected");
        const users = snapshot.val();
        const keys = Object.keys(users);
        const [localUserKey, remoteUserKey] = keys[0] === userRefDB ? [keys[0], keys[1]] : [keys[1], keys[0]];
        dispatch(meetActions.setLocalName({ localName: users[localUserKey].userName, localuserRefDB: localUserKey }));
        dispatch(meetActions.setRemoteName({ remoteName: users[remoteUserKey].userName, remoteuserRefDB: remoteUserKey }));
      } else {
        console.log("Waiting for other user to join");
        dispatch(meetActions.setNumberofUsers(1));
        dispatch(meetActions.setRemoteName({ remoteName: null, remoteuserRefDB: null }));
      }
    });

    return () => {
      off(participantRef);
    };
  }, [localName, remoteName, roomRef, userRefDB, dispatch]);

  return (
    <div className="meetSection">
      <div className="videoContainer">
        <video ref={localVideoRef} autoPlay playsInline muted></video>
        {remoteName ? <video ref={remoteVideoRef} autoPlay playsInline></video> : <h2>Waiting for other user to join</h2>}
      </div>
      <div className="user-info">
        <h2>{localName}</h2>
        <h2>{remoteName}</h2>
      </div>
    </div>
  );
}
