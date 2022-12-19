import { Navigate } from "react-router-dom";
import { useLocation, useHistory, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BioForm from "./BioForm";
import PreferencesForm from "./PreferencesForm";
import InterestsForm from "./InterestsForm";
import PictureForm from "./PictureForm";
import IntroForm from "./IntroForm";
import axios from 'axios';

const InitProfile = ({userId}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [params, setParams] = useState(new URLSearchParams(location.search));
    const [currentStep, setCurrentStep] = useState(0);

    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const [sexOrientation, setSexOrientation] = useState([]);
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        setParams(new URLSearchParams(location.search));
    }, [location]);

    function handleSubmit() {
        console.log(userId);
        axios.put(`http://localhost:3001/users/${userId}/update`, {
            bio:bio,
            interests:interests,
            sexOrientation:sexOrientation,
            pictures:pictures
        })
            .then(response => {
                console.log(response);

                // Remove the token and setup parameters from the URL
                params.delete('token');
                navigate(`/profile/${userId}`)
            })
            .catch(error => {
                console.log(error);
            });
    }


    function handleNextClick() {
        if (currentStep !== 4)
            setCurrentStep(currentStep + 1);
        else if(currentStep === 4 && pictures.length > 0)
         handleSubmit();
    }

    function handlePreviousClick() {
        if(currentStep !== 0)
            setCurrentStep(currentStep - 1);
    }

    console.log('infos:', "bio:", bio, "interests:", interests, "sexorientation:", sexOrientation, "pictures:", pictures);
    return (
        <>
            <div className="bg-emerald-600 min-h-screen">
                {currentStep === 0 && <IntroForm />}
                {currentStep === 1 && <BioForm setBio={setBio}/>}
                {currentStep === 2 && <PreferencesForm  setSexOrientation={setSexOrientation}/>}
                {currentStep === 3 && <InterestsForm interests={interests} setInterests={setInterests}/>}
                {currentStep === 4 && (
                        <PictureForm pictures={pictures} setPictures={setPictures}/>
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
                        <button onClick={handlePreviousClick} className="btn btn-sm btn-circle bg-indigo-800 hover:bg-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                            </svg>
                        </button>
                        {currentStep === 4 ?
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle hover:bg-indigo-600 ${pictures.length > 0 ? 'bg-indigo-800' : 'btn-disabled'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </button>
                        :
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle bg-indigo-800 hover:bg-indigo-600 `}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                </svg>
                            </button>

                        }

                    </div>
                </div>
            </div>
        </>
    );
}

export default InitProfile