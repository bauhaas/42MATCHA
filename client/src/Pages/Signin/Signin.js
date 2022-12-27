import React, { useState, useEffect } from "react"
import {useNavigate} from 'react-router-dom';
import useToggle from '../../Hooks/useToggle';
import useIsAuthenticated from '../../Hooks/useIsAuthenticated';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from "../../userSlice";

import position from '../../Context/position'

function Signin() {

  const [fakeUserName, setFakeUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([])
  const [isErrorToggle, setErrorToggle] = useToggle(false);
  const [rememberMe, setRememberMe] = useToggle(false)
  const { isAuthenticated } = useIsAuthenticated();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is already logged in
    if (isAuthenticated) {
      // Redirect the user to the Home page
      console.log("go to home cuz already sign")
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSignUpClick = (event) => {
    event.preventDefault();
    navigate("/signup");
  }

  const saveToRedux = (data) => {
    const user = jwt_decode(data);
    console.log('redux save', user);
    dispatch(setUser(user));
  }

  const [test, setTest] = useState({});

  const handleSignInClick = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/users/login', {
      email: email,
      password: password
    })
      .then(response => {
        console.log(response);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;

        if(rememberMe)
        {
          // TODO had issue with cookies lib
          // Set the JWT in a cookie that will be stored for 30 days
          console.log('toodo');
          // setCookie('jwt', response.data, { maxAge: 60 * 60 * 24 * 30 });
        }
        else
        {
          saveToRedux(response.data);
          setTest(response.data);
          localStorage.setItem('jwt', response.data);
        }
        navigate("/home");
      })
      .catch(error => {
        setErrorToggle(true);
        setError([error.response.status, error.response.data]);
        console.log(error);
      });
  }

  const fakeUser = (event) => {
    event.preventDefault();

    console.log(fakeUserName);
    console.log(position)
    axios.post('http://localhost:3001/users/fake', {
      fakeUserName: fakeUserName,
      position: position
    })
      .then(response => {
        console.log(response);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        saveToRedux(response.data);
        localStorage.setItem('jwt', response.data);
        navigate("/home");
      })
      .catch(error => {
        setErrorToggle(true);
        setError([error.response.status, error.response.data]);
        console.log(error);
      });
  }

  useEffect(() => {
    console.log('useEffect test lol');
  }, [test]);

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">

        <div className={` ${isErrorToggle ? null : "hidden"} w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-b absolute top-0`} role="alert">
          <p className="font-bold">Error {error[0]}</p>
          <p className="">{error[1]}</p>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={setErrorToggle}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>

        <img className="w-screen object-cover h-1/3 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
        <div className="w-full h-full md:w-1/2">
          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
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
              <input type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">Remember me</label>
              <label className="grow  text-end ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"><a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Forgot your password ?</a></label>
            </div>
            <button onClick={handleSignInClick} className="h-10 w-full items-center justify-center  gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
              <span>Sign in</span>
            </button>
            <label className="mt-2 self-start text-sm font-small text-gray-900 dark:text-gray-300">Not registered ? <a href="/signup" onClick={handleSignUpClick} className="text-blue-600 dark:text-blue-500 hover:underline">Create an account</a></label>

            <input  className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="fakeUserSetter"
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