import { Navigate } from "react-router-dom";
import { useLocation, useHistory, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BioForm from "./BioForm";
import PreferencesForm from "./PreferencesForm";
import InterestsForm from "./InterestsForm";
import PictureForm from "./PictureForm";
import IntroForm from "./IntroForm";

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

    function handleNextClick() {
        if (currentStep !== 4)
            setCurrentStep(currentStep + 1);
    }

    function handlePreviousClick() {
        if(currentStep !== 0)
            setCurrentStep(currentStep - 1);
    }

    return (
        <>
            <div className="bg-emerald-600 min-h-screen">
                {currentStep === 0 && <IntroForm />}
                {currentStep === 1 && <BioForm />}
                {currentStep === 2 && <PreferencesForm />}
                {currentStep === 3 && <InterestsForm />}
                {currentStep === 4 && (
                        <PictureForm />
                )}
                <div className="flex flex-col absolute bottom-5 left-0 right-0">
                    <ul className="steps steps-horizontal">
                        <li className={currentStep >= 0 ? 'step step-primary text-sm' : 'step text-sm'}>
                            Welcome
                        </li>
                        <li className={currentStep >= 1 ? 'step step-primary text-sm' : 'step text-sm'}>
                            Bio
                        </li>
                        <li className={currentStep >= 2 ? 'step step-primary text-sm' : 'step text-sm'}>
                            Orientation
                        </li>
                        <li className={currentStep >= 3 ? 'step step-primary text-sm' : 'step text-sm'}>
                            Hobbies
                        </li>
                        <li className={currentStep >= 4 ? 'step step-primary text-sm' : 'step text-sm'}>
                            Pictures
                        </li>
                    </ul>
                    <div className="flex justify-center gap-10 ">
                        <button onClick={handlePreviousClick} className="btn btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                            </svg>
                        </button>
                        <button onClick={handleNextClick} className={`btn btn-sm btn-circle ${currentStep === 4 ? 'btn-disabled' : null}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InitProfile