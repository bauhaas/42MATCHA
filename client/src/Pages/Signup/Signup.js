import React, { useState } from "react"
import useToggle from '../../Hooks/useToggle';
import WaitEmailConfirmation from "./Components/WaitEmailConfirmation";
import SignUpForm from "./Components/SignUpForm";

const Signup = () => {
  const [isErrorToggle, setErrorToggle] = useToggle(false);
  const [email, setEmail] = useState("");
  const [hasSignedUp, setHasSignedUP] = useToggle(false);
  const [error, setError] = useState([])

  console.log("hasSignedUp", hasSignedUp);
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

        <img className="w-screen object-cover h-1/4 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
        <div className="w-full h-full md:w-1/2">
          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
            {hasSignedUp ?
              <WaitEmailConfirmation email={email} setError={setError} setErrorToggle={setErrorToggle} />
              :
              <SignUpForm email={email} setEmail={setEmail} isErrorToggle={isErrorToggle} error={error} setError={setError} setErrorToggle={setErrorToggle} setHasSignedUP={setHasSignedUP} />
            }
          </div>
        </div>
    </div>
    </>
  )
}

export default Signup;