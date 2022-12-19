import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import Chat from './Pages/Chat/Chat';
import { Route, Routes } from 'react-router-dom';
import Conversation from './Pages/Chat/Components/Conversation';

function App() {
  return (
    <>
    <Routes>
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
