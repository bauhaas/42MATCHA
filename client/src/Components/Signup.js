import React, { useState } from "react"
import {useNavigate} from 'react-router-dom';

function Signup() {

    let navigate = useNavigate();

    const handleSignUpClick = (event) => {
      event.preventDefault();
      navigate("/home");
    }

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">


        <img className="w-screen object-cover h-1/3 md:w-1/2 md:h-screen" src='../aaa-transformed.jpeg' alt='Profile'/>
        <div className="w-full h-full md:w-1/2">
          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
            <h1 className="self-start text-2xl font-bold mb-2">Create your account</h1>
            <label className="block text-gray-700 text-sm font-bold self-start mb-1">
              First name
            </label>
            <input className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="John"/>
            <label className="block text-gray-700 text-sm font-bold self-start mb-1">
              Last Name
            </label>
            <input className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Doe"/>
            <label className="block text-gray-700 text-sm font-bold self-start mb-1">
              Email address
            </label>
            <input className="shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="john.doe@gmail.com"/>
            <label className="block text-gray-700 text-sm font-bold self-start mb-1">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********"/>
            <label className="block text-gray-700 text-sm font-bold self-start mb-1">
              Password confirmation
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********"/>
            <button onClick={handleSignUpClick} className="h-10 w-full items-center justify-center  gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
              <span>Sign up</span>
            </button>
          </div>
        </div>
    </div>
    </>
  )
}

export default Signup;