import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import Chat from './Pages/Chat/Chat';
import Conversation from './Pages/Chat/Components/Conversation';

import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import {socket, SocketContext} from './Context/socket';

function App() {
  return (
    <>
    <Routes>
        <Route exact path="/" element={ <Navigate to="/home" /> } />
        <Route path='/home' element={<Home />} />
        <Route exact path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/profile/' element={<Profile />} />
        <Route path='/chat/' element={<Chat />} />
        <Route path='/chat/:id' element={<Conversation />} />
        <Route path='*' element={<Unknown />} />
    </Routes>
    </>
  );
}

export default App;
