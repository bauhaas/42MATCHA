import Home from './Components/Home';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Unknown from './Components/Unkown';
import Profile from './Components/Profile';
import { Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import {socket, SocketContext} from './context/socket';

function App() {
  return (
    <>
    <Routes>
        <Route path='/home' element={<HomeWithContext />} />
        <Route exact path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<ProfileWithContext />} />
        <Route path='*' element={<Unknown />} />
    </Routes>

    </>
  );
}

function HomeWithContext() {
  const socket = useContext(SocketContext);
  return <Home socket={socket} />;
}

function ProfileWithContext() {
  const socket = useContext(SocketContext);
  return <Profile socket={socket} />;
}

export default App;
