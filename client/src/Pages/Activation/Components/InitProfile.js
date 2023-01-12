import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BioForm from "./BioForm";
import PreferencesForm from "./PreferencesForm";
import InterestsForm from "./InterestsForm";
import PictureForm from "./PictureForm";
import IntroForm from "./IntroForm";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeFile, setFiles, setUser, updateFiles } from "../../../userSlice";

const InitProfile = ({user}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [params, setParams] = useState(new URLSearchParams(location.search));
    const [currentStep, setCurrentStep] = useState(0);

    const [bio, setBio] = useState("");
    const [job, setJob] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [interests, setInterests] = useState([]);
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState('');
    const [sexOrientation, setSexOrientation] = useState('');
    const [pictures, setPictures] = useState([]);
    const [upload, setToUpload] = useState([]);

    console.log(user, pictures,'upload:', upload);
    // const uploadPhoto = async () => {}

    const handleSubmit = async () => {
        console.log(user.id);
        await axios.put(`http://localhost:3001/users/${user.id}/update`, {
            bio: bio,
            age: age,
            sex: sex,
            city: city,
            job: job,
            country: country,
            sex_orientation:sexOrientation,
            interests:interests,
            active: true
        })
            .then(async response => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                console.log(response);
                console.log(upload);
                dispatch(setUser(response.data));

                if (upload.length > 0) {
                    for (let i = 0; i < upload.length; i++) {
                        const file = upload[i];

                        console.log(user.id, file);
                        const formData = new FormData();
                        formData.append('file', file); // file is the file that you get from the input element's onChange event
                        formData.append('user.id', user.id);
                        formData.append('is_profile_pic', true);
                        await axios.post(`http://localhost:3001/users/${user.id}/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then((response) => {
                                console.log(response);
                                console.log('redux save', response);
                                dispatch(updateFiles(response.data));
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                // Remove the token and setup parameters from the URL
                params.delete('token');
                navigate(`/profile/${user.id}`)
            })
            .catch(error => {
                console.log(error);
            });


    }

    const handleNextClick = () => {
        if (currentStep !== 4)
            setCurrentStep(currentStep + 1);
        else if(currentStep === 4 && pictures.length > 0)
            handleSubmit();
    }

    const handlePreviousClick = () => {
        if(currentStep !== 0)
            setCurrentStep(currentStep - 1);
    }

    useEffect(() => {
        setParams(new URLSearchParams(location.search));
    }, [location]);


    return (
        <>
            <div className="bg-chess-default text-white min-h-screen">
                {currentStep === 0 && <IntroForm />}
                {currentStep === 1 && <BioForm bio={bio} setBio={setBio}/>}
                {currentStep === 2 && <PreferencesForm age={age} setAge={setAge} sex={sex} setSex={setSex} sexOrientation={sexOrientation} setSexOrientation={setSexOrientation} job={job} setJob={setJob} city={city} setCity={setCity} country={country} setCountry={setCountry} />}
                {currentStep === 3 && <InterestsForm interests={interests} setInterests={setInterests} />}
                {currentStep === 4 && (
                    <PictureForm pictures={pictures} setPictures={setPictures} setToUpload={setToUpload}/>
                )}
                <div className="flex flex-col absolute bottom-5 left-0 right-0">
                    <ul className="steps steps-horizontal">
                        <li className={currentStep >= 0 ? 'step  step-error text-sm' : 'step text-sm'}>Welcome</li>
                        <li className={currentStep >= 1 ? 'step step-error text-sm' : 'step text-sm'}>Bio</li>
                        <li className={currentStep >= 2 ? 'step step-error text-sm' : 'step text-sm'}>Details</li>
                        <li className={currentStep >= 3 ? 'step step-error text-sm' : 'step text-sm'}>Hobbies</li>
                        <li className={currentStep >= 4 ? 'step step-error text-sm' : 'step text-sm'}>Pictures</li>
                    </ul>
                    <div className="flex justify-center gap-10 ">
                        <button onClick={handlePreviousClick} className="btn btn-sm btn-circle bg-mid-logo hover:bg-bot-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                            </svg>
                        </button>
                        {
                        currentStep === 4 ?
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle hover:bg-bot-logo ${pictures.length > 0 ? 'bg-mid-logo' : 'btn-disabled'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </button>
                        :
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle bg-mid-logo hover:bg-bot-logo `}>
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