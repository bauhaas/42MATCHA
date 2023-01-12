import Navbar from './Pages/Navbar/NavBar';

import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import Chat from './Pages/Chat/Chat';
import Conversation from './Pages/Chat/Components/Conversation';
import Settings from './Pages/Settings/Settings';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import socket from './Context/socket';
import Password from './Pages/Settings/Components/Password';
import LikedUsers from './Pages/Settings/Components/LikedUsers';
import MatchedUsers from './Pages/Settings/Components/MatchedUsers';
import BlockedUsers from './Pages/Settings/Components/BlockedUsers';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import {store, persistor} from './store';
import { PersistGate } from 'redux-persist/integration/react';

import  { successCallback, errorCallback } from './Context/position'
import Activation from './Pages/Activation/Activation';

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function App() {
  const unauthenticatedRoutes = ['/signin', '/signup', '/activation', '*'];

  useEffect(() => {
        return () => {
          if (socket.client && socket.client.connected === true) {
            socket.disconnect();
          }
      }
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const token = localStorage.getItem("jwt");
      console.log('u dont wait for token')
      console.log(token, location.pathname, unauthenticatedRoutes.includes(location.pathname));
      if (!token && !unauthenticatedRoutes.includes(location.pathname)) {
        navigate("/signin", { replace: true });
      }
    }, []);

    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
      setParams(new URLSearchParams(location.search));
  }, [location]);

    useEffect(() => {
      const token = localStorage.getItem("jwt");


      if (!token) {
          setIsAuth(false)
          setLoading(false)
      } else {
        setIsAuth(true)
        setLoading(false)
      }
    }, [isAuth]);

    if (loading) {
      return <div>Loading a...</div>;
    }

    if (!isAuth && !unauthenticatedRoutes.includes(location.pathname)) {
      console.log('u not auth')
      navigate("/signin", { replace: true });
      return <div>Loading (u not auth and not in authorized routes)...</div>;
    }

    return (
    <>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Routes>
              <Route index element={<Navigate to="/home" />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/signup' element={<Signup />} />
              <Route path="/activation" element={<Activation />} />
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
              <Route path='*' element={<Unknown />} />
            </Routes>
          </PersistGate>
      </Provider>
    </>
  );
}

export default App;