import Home from './Pages/Home/Home';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Unknown from './Pages/Unknown/Unknown';
import Profile from './Pages/Profile/Profile';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>
        <Route path='/home' element={<Home />} />
        <Route exact path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/profile/' element={<Profile />} />
        <Route path='*' element={<Unknown />} />
    </Routes>
    </>
  );
}

export default App;
