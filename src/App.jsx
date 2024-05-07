import React, { useState, useEffect } from 'react';
// import firepadRef, { connectedRef } from './server/firebase';
// import { userName } from './server/firebase';
// import { getDatabase, ref, push, child, onValue, onDisconnect, off } from 'firebase/database';
import StartPage from './Components/StartPage';
import { useSelector } from 'react-redux';

import CreateRoom from './Components/CreateRoom';

function App() {

  const isOptionSelected = useSelector((state) => state.ui.isOptionSelected);
  const valueOption = useSelector((state) => state.ui.valueOption);  

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
       <StartPage  />
      </>



  );
}

export default App;
