import React, { useState, useEffect, useContext } from "react"
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import api from "../../ax";
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from "../../userSlice";
import position from '../../Context/position'
import CustomAlert from "../../SharedComponents/CustomAlert";
import { ErrorContext } from "../../Context/error";

function Signin() {

  const [fakeUserName, setFakeUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdSent, setPwdSent] = useState(false);
  const { setError, setShowError } = useContext(ErrorContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        const user = jwt_decode(response.data);
        dispatch(setUser(user));
        localStorage.setItem('jwt', response.data);
        navigate("/home");
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        setShowError(true);
      });
  }

  const fakeUser = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/users/fake', {
      fakeUserName: fakeUserName,
      position: position
    })
      .then(response => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        const user = jwt_decode(response.data);
        dispatch(setUser(user));
        localStorage.setItem('jwt', response.data);
        navigate("/home");
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        setShowError(true);
      });
  }

  const forgotPassword = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/users/resetPassword', {
      email: email
    })
      .then(response => {
        setPwdSent(true);
      })
      .catch(error => {
        setError([error.response.status, error.response.data]);
        setShowError(true);
      });
  }

  return (
    <>
      <div className="flex flex-col items-center content-start h-screen md:flex-row-reverse">
          <CustomAlert/>
          <img className="object-cover w-screen h-1/3 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
          <div className="flex justify-center w-full h-full md:w-1/2">
            <div className="flex flex-col items-center justify-center w-3/4 min-h-full sm:w-1/2">
              <img className="self-start w-1/5" src='../logo.png' alt='logo'/>
              <h1 className="self-start mb-4 text-2xl font-bold">Sign in to your account</h1>
            <form className="self-start block mb-2 text-sm font-bold text-gray-700">
                <label>Email address</label>
                <input className="w-full px-3 py-2 mb-4 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="john.doe@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)} />
                <label>Password</label>
                <input className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********" autoComplete="on"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)} />
              </form>

              <div className="flex items-center w-full mb-4">
                <button onClick={forgotPassword} className="ml-2 text-sm font-medium text-blue-600 grow text-end dark:text-blue-500 hover:underline">
                  <span>Forgot your password ?</span>
                </button>
              </div>
              {pwdSent ? <div>Sent temp password via mail</div> : null}
              <button onClick={handleSignInClick} className="items-center justify-center w-full h-10 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
                <span>Sign in</span>
              </button>
              <label className="self-start mt-2 text-sm text-gray-900 font-small dark:text-gray-300">Not registered ? <a href="/signup" onClick={handleSignUpClick} className="text-blue-600 dark:text-blue-500 hover:underline">Create an account</a></label>
              <input  className="w-full px-3 py-2 mb-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="fakeusername" type="text" placeholder="random"
                      value={fakeUserName}
                      onChange={(event) => setFakeUserName(event.target.value)} />
              <button onClick={fakeUser} className="items-center justify-center w-full h-10 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
                <span>Sign in with random</span>
              </button>
            </div>

          </div>
      </div>
    </>
  )
}

export default Signin;