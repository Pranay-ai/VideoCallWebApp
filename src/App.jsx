
// import firepadRef, { connectedRef } from './server/firebase';
// import { userName } from './server/firebase';
// import { getDatabase, ref, push, child, onValue, onDisconnect, off } from 'firebase/database';
import { Outlet } from 'react-router-dom';

function App() {


  // console.log(connectedRef)


  // useEffect(() => {


  //   const participantsRef = child(firepadRef, 'participants');
    
  //   const checkConnection = onValue(connectedRef, snap => {
  //     if (snap.val() === true) {
  //       console.log('connected');

  //       const defaultPrefs = {
  //         audio: false,
  //         video: false,
  //         screen: false
  //       };
  //       const userRef = push(participantsRef, { userName, preferences: defaultPrefs });
  //       onDisconnect(userRef).remove();
  //     } else {
  //       console.log('not connected');
  //     }
  //   });

  //   // Cleanup function to unsubscribe from the event listener
  //   return () => off(connectedRef, 'value', checkConnection);
  // }, []);


  return (

      <>
        <Outlet />
      </>



  );
}

export default App;
