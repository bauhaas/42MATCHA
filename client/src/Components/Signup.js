import React, { useEffect, useState, useCallback } from "react"
import {useNavigate} from 'react-router-dom';
import useValidator from '../hooks/useValidator'
import axios from 'axios';

// Hook
// Parameter is the boolean, with default "false" value
const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the component,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setState(state => !state), []);

  return [state, toggle]
}

function Signup() {

    const [isErrorToggle, setErrorToggle] = useToggle(false);
    const [error, setError] = useState([])
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [invalidFields, setInvalidFields] = useState([]);
    const [validator, showValidationMessage] = useValidator(null,
    {
      match: {
        rule: () => {
          return password === passwordConfirm;
        },
      }
    });

    let navigate = useNavigate();

    const addUser = () => {
      axios.post('http://localhost:3001/users', {
        firstName: firstName,
        lastName: lastName,
        email:email,
        password:password
      })
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          setErrorToggle(true);
          setError([error.response.status, error.response.data]);
          console.log(error);
          console.log(error.response.data);
        });
    }

    const handleSignUpClick = (event) => {
      event.preventDefault();

      if (validator.allValid()) {
        console.log("form is valid");
        // navigate()
        addUser();


      } else {
        const invalidFieldsSet = new Set(invalidFields);
        (!validator.check(firstName, "required|alpha|max:15")) ? invalidFieldsSet.add('firstName') : invalidFieldsSet.delete('firstName');
        (!validator.check(lastName, "required|alpha|max:15")) ? invalidFieldsSet.add('lastName') : invalidFieldsSet.delete('lastName');
        (!validator.check(email, "required|email")) ? invalidFieldsSet.add('email') : invalidFieldsSet.delete('email');
        (!validator.check(password, "required")) ? invalidFieldsSet.add('password')  : invalidFieldsSet.delete('password');
        (!validator.check(passwordConfirm, "required|match")) ? invalidFieldsSet.add('passwordConfirm')  : invalidFieldsSet.delete('passwordConfirm');

        // validator.showMessages();
        // rerender to show messages for the first time
        console.log(invalidFieldsSet);
        showValidationMessage(true);
        setInvalidFields(Array.from(invalidFieldsSet));
        return
      }
    }

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">

        <div className={` ${isErrorToggle ?  null : "hidden"} w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-b absolute top-0`} role="alert">
          <p className="font-bold">Error {error[0]}</p>
          <p className="">{error[1]}</p>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={setErrorToggle}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>

        <img className="w-screen object-cover h-1/4 md:w-1/2 md:h-screen" src='../aaa-transformed.jpeg' alt='Profile'/>
        <div className="w-full h-full md:w-1/2">



          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
            <h1 className="self-start text-2xl font-bold mb-2">Create your account</h1>
            <label className={`block ${invalidFields.includes('firstName') ? "text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
              First name
              <span className="text-red-500 font-normal inline-block pl-1">
                {validator.message("firstName", firstName, "required|alpha|max:15", {
                messages: {
                  required: " is required",
                  alpha: " isn't valid",
                  max:" too long"
                }
              })}</span>
            </label>
            <input className={`${invalidFields.includes('firstName') ? "text-red-500 border-red-500" : "text-gray-700"} shadow appearance-none border rounded w-full mb-4 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`} id="firstname" type="text" placeholder="John"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)} />

            <label className={`block ${invalidFields.includes('lastName') ? "text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
              Last Name
              <span className="text-red-500 font-normal inline-block pl-1">{validator.message("lastName", lastName, "required|alpha|max:15", {
                messages: {
                  required: " is required",
                  alpha: " isn't valid",
                  max: "too long"
                }
              })}</span>
            </label>
            <input className={`shadow appearance-none border rounded w-full mb-4 py-2 px-3 ${invalidFields.includes('lastName') ? " text-red-500 border-red-500" : "text-gray-700"} leading-tight focus:outline-none focus:shadow-outline`} id="lastname" type="text" placeholder="Doe"
                   value={lastName}
                   onChange={(event) => setLastName(event.target.value)} />

            <label className={`block ${invalidFields.includes('email') ? "text-red-500 border-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
              Email address
              <span className="text-red-500 font-normal inline-block pl-1">{validator.message("email", email, "required|email", {
                messages: {
                  required: " is required",
                  email: ' isn\'t valid'
                }
              })}</span>
            </label>
            <input className={`shadow appearance-none border rounded w-full mb-4 py-2 px-3 ${invalidFields.includes('email') ? "text-red-500 border-red-500" : "text-gray-700"} leading-tight focus:outline-none focus:shadow-outline`} id="email" type="text" placeholder="john.doe@gmail.com"
                   value={email}
                   onChange={(event) => setEmail(event.target.value)} />

            <label className={`block ${invalidFields.includes('password') ? " text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
              Password
            </label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 ${invalidFields.includes('password') ? " text-red-500 border-red-500" : "text-gray-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="***********" value={password} onChange={(event) => setPassword(event.target.value)} />

            <label className={`block ${invalidFields.includes('passwordConfirm') ? "text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
              Password confirmation
              <span className="text-red-500 font-normal inline-block pl-1">{validator.message("passwordConfirm", passwordConfirm, "required|match", {
                messages: {
                  required: " is required",
                  match: "doesn't match"
                },
              })}</span>
            </label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 ${invalidFields.includes('passwordConfirm') ? "text-red-500 border-red-500" : "text-gray-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="passwordConfirm" type="password" placeholder="***********" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} />
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