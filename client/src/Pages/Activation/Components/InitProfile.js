import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BioForm from "./BioForm";
import PreferencesForm from "./PreferencesForm";
import InterestsForm from "./InterestsForm";
import PictureForm from "./PictureForm";
import IntroForm from "./IntroForm";
import axios from 'axios';
import api from '../../../ax';
import { useDispatch } from 'react-redux';
import { setUser, updateFiles } from "../../../userSlice";
import { AiOutlineCheck, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

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

    const handleSubmit = async () => {
        await api.put(`http://localhost:3001/users/${user.id}/update`, {
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
                dispatch(setUser(response.data));

                if (upload.length > 0) {
                    for (let i = 0; i < upload.length; i++) {
                        const file = upload[i];

                        const formData = new FormData();
                        formData.append('file', file); // file is the file that you get from the input element's onChange event
                        formData.append('user.id', user.id);
                        formData.append('is_profile_pic', true);
                        await api.post(`http://localhost:3001/users/${user.id}/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then((response) => {
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
        else if(currentStep === 4)
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
                            <AiOutlineArrowLeft/>
                        </button>
                        {
                        currentStep === 4 ?
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle hover:bg-bot-logo ${pictures.length > 0 && bio && age && sex && city && job && country && sexOrientation && interests[0]? 'bg-mid-logo' : 'btn-disabled'}`}>
                                <AiOutlineCheck/>
                            </button>
                        :
                            <button onClick={handleNextClick} className={`btn btn-sm btn-circle bg-mid-logo hover:bg-bot-logo `}>
                                <AiOutlineArrowRight />
                            </button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default InitProfile