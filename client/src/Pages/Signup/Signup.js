import React, { useState } from "react"
import useToggle from '../../Hooks/useToggle';
import WaitEmailConfirmation from "./Components/WaitEmailConfirmation";
import SignUpForm from "./Components/SignUpForm";
import CustomAlert from "../../SharedComponents/CustomAlert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [hasSignedUp, setHasSignedUP] = useToggle(false);
  const [error, setError] = useState([])
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="h-screen flex flex-col md:flex-row-reverse items-center content-start">
        {/* <CustomAlert error={error} open={open} setOpen={setOpen} /> */}
        <img className="w-screen object-cover h-1/4 md:w-1/2 md:h-screen" src='../bg-signin-signup.jpeg' alt='bg-signin-signup'/>
        <div className="w-full h-full md:w-1/2">
          <div className="w-full min-h-full flex flex-col items-center justify-center px-10 md:px-36">
            {hasSignedUp ?
              <WaitEmailConfirmation email={email} setError={setError} setOpen={setOpen} />
              :
              <SignUpForm email={email} setEmail={setEmail} setError={setError} setOpen={setOpen} setHasSignedUP={setHasSignedUP} />
            }
          </div>
        </div>
    </div>
    </>
  )
}

export default Signup;