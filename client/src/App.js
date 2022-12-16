import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import { Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import {socket, SocketContext} from './Context/socket';

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
