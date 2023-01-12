import React, { useState, useEffect } from "react"
import {useNavigate} from 'react-router-dom';
import useToggle from '../../Hooks/useToggle';
import useIsAuthenticated from '../../Hooks/useIsAuthenticated';
import axios from 'axios';
import api from "../../ax";
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from "../../userSlice";
import position from '../../Context/position'
import CustomAlert from "../../SharedComponents/CustomAlert";
// import Cookies from 'js-cookie';

function Signin() {

  const [fakeUserName, setFakeUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [pwdSent, setPwdSent] = useState(false);
  const [error, setError] = useState([])
  // const { isAuthenticated } = useIsAuthenticated();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (isAuthenticated)
  //     navigate('/home');
  // }, [isAuthenticated, navigate]);

  const handleSignUpClick = (event) => {
    event.preventDefault();
    navigate("/signup");
  }

  const handleSignInClick = (event) => {
    event.preventDefault();

    console.log('post login');
    axios.post('http://localhost:3001/users/login', {
      email: email,
      password: password
    })
      .then(response => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        console.log('post login success');
        const user = jwt_decode(response.data);
        dispatch(setUser(user));
        localStorage.setItem('jwt', response.data);
        navigate("/home");
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        setOpen(true);
        console.log(error);
      });
  }

  const fakeUser = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/users/fake', {
      fakeUserName: fakeUserName,
      position: position
    })
      .then(response => {
        // Cookies.set('jwt', response.data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        const user = jwt_decode(response.data);
        dispatch(setUser(user));
        localStorage.setItem('jwt', response.data);
        navigate("/home");
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        console.log(error);
      });
  }

  const forgotPassword = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/users/resetPassword', {
      email: email
    })
      .then(response => {
        console.log("set new password, check email");
        setPwdSent(true);
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        console.log(error);
      });
  }

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">

        <CustomAlert error={error} open={open} setOpen={setOpen}/>
        <img className="w-screen object-cover h-1/3 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
        <div className="w-full h-full md:w-1/2 flex justify-center">
          <div className="w-3/4 sm:w-1/2 min-h-full flex flex-col items-center justify-center">
            <img className="w-1/5 self-start" src='../logo.png' alt='logo'/>
            <h1 className="self-start text-2xl font-bold mb-4">Sign in to your account</h1>
            <label className="block text-gray-700 text-sm font-bold self-start mb-2">
              Email address
            </label>
            <input  className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="john.doe@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)} />
            <label className="block text-gray-700 text-sm font-bold self-start mb-2">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********"
              value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <div className="w-full flex items-center  mb-4">
              <button onClick={forgotPassword} className="grow  text-end ml-2 text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">
                <span>Forgot your password ?</span>
              </button>
            </div>
            {pwdSent ? <div>Sent temp password via mail</div> : <></>}
            <button onClick={handleSignInClick} className="h-10 w-full items-center justify-center  gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
              <span>Sign in</span>
            </button>
            <label className="mt-2 self-start text-sm font-small text-gray-900 dark:text-gray-300">Not registered ? <a href="/signup" onClick={handleSignUpClick} className="text-blue-600 dark:text-blue-500 hover:underline">Create an account</a></label>


            <input  className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fakeusername" type="text" placeholder="fake username"
                    value={fakeUserName}
                    onChange={(event) => setFakeUserName(event.target.value)} />
            <button onClick={fakeUser} className="h-10 w-full items-center justify-center  gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
              <span>Generate Fake User for testing</span>
            </button>
          </div>

        </div>
    </div>
    </>
  )
}

export default Signin;