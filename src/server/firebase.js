// Importing individual components from Firebase to reduce bundle size
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDvfSghwvdAiLEzWe95CAxzr_e1KS7BHLo",
  authDomain: "webrtc-4652f.firebaseapp.com",
  databaseURL: "https://webrtc-4652f-default-rtdb.firebaseio.com",
  projectId: "webrtc-4652f",
  storageBucket: "webrtc-4652f.appspot.com",
  messagingSenderId: "554176975004",
  appId: "1:554176975004:web:a10cd45d751a2ccf9f5d59",
  measurementId: "G-JBHC0M7KF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Creating a reference to the root of the database
let firepadRef = ref(database);

// Creating an Info Connected to the Database

export let connectedRef = ref(database, ".info/connected");

const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");


if(roomId) {
  firepadRef = child(firepadRef, roomId);
}



export default firepadRef;
