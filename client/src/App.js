
import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import Chat from './Pages/Chat/Chat';
import Conversation from './Pages/Chat/Components/Conversation';
import Settings from './Pages/Settings/Settings';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import socket from './Context/socket';
import Password from './Pages/Settings/Components/Password';
import LikedUsers from './Pages/Settings/Components/LikedUsers';
import MatchedUsers from './Pages/Settings/Components/MatchedUsers';
import BlockedUsers from './Pages/Settings/Components/BlockedUsers';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import {store, persistor} from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorContext } from './Context/error';
import  { successCallback, errorCallback } from './Context/position'
import Activation from './Pages/Activation/Activation';
import { ProtectedLayout } from './ProtectedLayout';

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function App() {

  const [error, setError] = useState([]);
  const [severity, setSeverity] = useState("error");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
        return () => {
          if (socket.client && socket.client.connected === true) {
            socket.disconnect();
          }
      }
    }, [])

    return (
    <>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ErrorContext.Provider value={{ error, setError, showError, setShowError, severity, setSeverity }}>
              <Routes>
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/activation" element={<Activation />} />

                <Route path="/" element={<ProtectedLayout />}>
                  <Route index element={<Navigate to="/home" />} />
                  <Route path='/home' element={<Home />} />
                  <Route path='/profile/:id' element={<Profile />} />
                  <Route path='/profile/' element={<Profile />} />
                  <Route path='/chat/' element={<Chat />} />
                  <Route path='/chat/:id' element={<Conversation />} />
                  <Route path='settings'>
                    <Route index element={<Settings />} />
                    <Route path="blockedUsers" element={<BlockedUsers />} />
                    <Route path="matchedUsers" element={<MatchedUsers />} />
                    <Route path="likedUsers" element={<LikedUsers />} />
                    <Route path="password" element={<Password />} />
                  </Route>
                </Route>
                <Route path='*' element={<Unknown />} />
              </Routes>
            </ErrorContext.Provider>
          </PersistGate>
      </Provider>
    </>
  );
}

export default App;