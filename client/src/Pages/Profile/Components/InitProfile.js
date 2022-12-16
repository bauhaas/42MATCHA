import { Navigate } from "react-router-dom";
import { useLocation, useHistory, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BioForm from "./BioForm";
import PreferencesForm from "./PreferencesForm";
import InterestsForm from "./InterestsForm";
import PictureForm from "./PictureForm";

const InitProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
        setParams(new URLSearchParams(location.search));
    }, [location]);


    function handleSubmit() {
        // Remove the token and setup parameters from the URL
        params.delete('token');
        navigate('/profile')
    }

    const [currentStep, setCurrentStep] = useState(0);
    const stepColors = ['red', 'orange', 'yellow', 'green'];

    function handleNextClick() {
        if (currentStep !== 3)
            setCurrentStep(currentStep + 1);
    }

    function handlePreviousClick() {
        if(currentStep !== 0)
            setCurrentStep(currentStep - 1);
    }

    return (
        <>
            <div className="bg-emerald-600 min-h-screen flex flex-col">
                {currentStep === 0 && <BioForm />}
                {currentStep === 1 && <PreferencesForm />}
                {currentStep === 2 && <InterestsForm />}
                {currentStep === 3 && <PictureForm />}
                <ul className="steps steps-horizontal">
                    <li className={currentStep >= 0 ? 'step step-primary' : 'step'}>
                        Bio
                    </li>
                    <li className={currentStep >= 1 ? 'step step-primary' : 'step'}>
                        Preferences
                    </li>
                    <li className={currentStep >= 2 ? 'step step-primary' : 'step'}>
                        Interests
                    </li>
                    <li className={currentStep >= 3 ? 'step step-primary' : 'step'}>
                        Pictures
                    </li>
                </ul>
                <div className="flex justify-center gap-10 ">
                    <button onClick={handlePreviousClick} className="btn btn-sm btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>
                    </button>
                    <button onClick={handleNextClick} className="btn btn-sm btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}

{/* <button onClick={handleSubmit} className='border-2 border-red-600 bg-red-400'>send setting</button> */}

export default InitProfile