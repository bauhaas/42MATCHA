import './App.css';
import { Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Unknown from './Components/Unkown';

function App() {
  return (
    <>
      <Routes>
          <Route path='/home' element={<Home />} />
          <Route exact path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<Unknown />} />
      </Routes>
    </>
  );
}


export default App;
