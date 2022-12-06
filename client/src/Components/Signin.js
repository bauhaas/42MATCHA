import React, { useState } from "react"
import {useNavigate} from 'react-router-dom';

function Signin() {

  let navigate = useNavigate();

  const handleSignUpClick = (event) => {
    event.preventDefault();
    navigate("/signup");
  }

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">


        <img className="w-screen object-cover h-1/3 md:w-1/2 md:h-screen" src='../aaa-transformed.jpeg' alt='Profile'/>
        <div className="w-full h-full md:w-1/2">
          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
            <img className="w-1/5 self-start" src='../logo2-B65YbTK81-transformed.png' alt='logo'/>
            <h1 className="self-start text-2xl font-bold mb-4">Sign in to your account</h1>
            <label className="block text-gray-700 text-sm font-bold self-start mb-2">
              Email address
            </label>
            <input className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="john.doe@gmail.com"/>
            <label className="block text-gray-700 text-sm font-bold self-start mb-2">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********"/>
            <div className="w-full flex items-center  mb-4">
              <input type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">Remember me</label>
              <label className="grow  text-end ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"><a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Forgot your password ?</a></label>
            </div>
            <button className="h-10 w-full items-center justify-center  gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
              <span>Sign in</span>
            </button>
            <label className="mt-2 self-start text-sm font-small text-gray-900 dark:text-gray-300">Not registered ? <a href="/signup" onClick={handleSignUpClick} className="text-blue-600 dark:text-blue-500 hover:underline">Create an account</a></label>
          </div>
        </div>
    </div>
    </>
  )
}

export default Signin;