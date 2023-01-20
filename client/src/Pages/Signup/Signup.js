import React, { useState } from "react";
import useToggle from '../../Hooks/useToggle';
import WaitEmailConfirmation from "./Components/WaitEmailConfirmation";
import SignUpForm from "./Components/SignUpForm";
import CustomAlert from "../../SharedComponents/CustomAlert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [hasSignedUp, setHasSignedUP] = useToggle(false);

  return (
    <>
    <div className="flex flex-col items-center content-start h-screen md:flex-row-reverse">
        <CustomAlert />
        <img className="object-cover w-screen h-1/4 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
        <div className="w-full h-full md:w-1/2">
          <div className="flex flex-col items-center justify-center w-full min-h-full px-10 md:px-36">
            {hasSignedUp ?
              <WaitEmailConfirmation email={email} />
              :
              <SignUpForm email={email} setEmail={setEmail} setHasSignedUP={setHasSignedUP} />
            }
          </div>
        </div>
    </div>
    </>
  )
}

export default Signup;