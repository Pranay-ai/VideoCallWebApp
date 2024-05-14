import { useEffect, useRef } from "react";
import firepadRef from '../server/firebase';
import { useSelector } from "react-redux";
import { child, onValue, set, push, off } from 'firebase/database';
export default function Meet(){

  const remoteVideoRef = useRef();
  const localVideoRef = useRef();
  const userRefDB = useSelector((state) => state.userInfo.userRefDB);
  const isCaller = useSelector((state) => state.userInfo.isCaller);
  let roomRef = null;
  if(isCaller){
    roomRef=useSelector((state)=>state.createRoom.roomId);
  }
  else{
    roomRef=useSelector((state)=>state.join.RoomId);
  }
  const pc = useRef(null);
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  useEffect(()=>{
    const initWebRTC=async()=>{

      const stream = await getUserMedia();
      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream);
      });

      pc.current.ontrack = event => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
      const localuserRef = child(firepadRef, 'rooms/' + roomRef + '/users/' + userRefDB);

      const allUsersRef = child(firepadRef, 'rooms/' + roomRef + '/users');

      const offerRef=child(firepadRef, 'rooms/' + roomRef + '/offers');
      const answerRef=child(firepadRef, 'rooms/' + roomRef + '/answers');
      const candidateRef=child(firepadRef, 'rooms/' + roomRef + '/candidates');

      pc.current.onicecandidate = event => {
        if (event.candidate) {
          push(candidateRef,{ candidate:  event.candidate.toJSON(), userRefDB });
        }
      };

      if (isCaller) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        set(offerRef, { offer: pc.current.localDescription.toJSON(), userRefDB });
      }
      onValue(offerRef, async (snapshot) => {
        if (!isCaller && !pc.current.currentRemoteDescription && snapshot.exists()) {
          const data = snapshot.val();
          if (data.userRefDB !== userRefDB) {  // Ensure it's not catching own offer
            const offerDescription = new RTCSessionDescription(data.offer);
            await pc.current.setRemoteDescription(offerDescription);
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            set(answerRef, { answer: pc.current.localDescription.toJSON(), userRefDB });
          }
        }
      });
      onValue(candidateRef, snapshot => {
        snapshot.forEach(childSnapshot => {
          if(childSnapshot.val().userRefDB === userRefDB) return;
          const candidate = new RTCIceCandidate(childSnapshot.val().candidate);
          pc.current.addIceCandidate(candidate)
            .then(() => console.log('ICE candidate added successfully'))
            .catch(e => console.error('Error adding ICE candidate:', e));
        });
      });

      onValue(answerRef, snapshot => {
        if (snapshot.exists() && !pc.current.currentRemoteDescription) {
          const data = snapshot.val();
          if (data.userRefDB !== userRefDB) {  // Ensure it's not catching own answer
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.current.setRemoteDescription(answerDescription);
          }
        }
      });

      return () => {
        off(offerRef);
        off(answerRef);
        off(candidateRef);
      };
      
    };

    if(roomRef && userRefDB){
      initWebRTC();
    }

  },[roomRef, userRefDB, isCaller])




  return (
    <div className="meetSection">
      <div className="videoContainer">
        <video ref={localVideoRef} autoPlay playsInline muted></video>
        <video ref={remoteVideoRef} autoPlay playsInline muted></video>
      </div>
      <div className="user-info">
        <h2>User Name</h2>
      </div>
    </div>
  );
}