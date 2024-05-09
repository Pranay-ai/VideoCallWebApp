import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import StartPage from './Components/StartPage.jsx'
import CreateRoom from './Components/CreateRoom.jsx'
import JoinRoom from './Components/JoinRoom.jsx'
import App from './App.jsx'
import Meet from './Components/Meet.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index:true, element: <StartPage /> },
      { path: 'create-room', element: <CreateRoom /> },
      { path: 'join-room', element: <JoinRoom /> },
      { path: 'meet', element: <Meet />},

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  

                <Provider store={store}>
                       <RouterProvider router={router} />
                </Provider>



)
