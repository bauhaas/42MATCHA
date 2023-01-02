import React, { useState, useEffect } from 'react';
import NavBar from '../Navbar/NavBar';
import SettingsMenu from './Components/SettingsMenu';
import SettingsProfile from './Components/SettingsProfile';
import axios from 'axios';
import SettingsHeader from './Components/SettingsHeader';
import { useSelector } from 'react-redux';

const Settings = () => {
    useEffect(() => { // set checked radio button on mount
        document.getElementById(gender === "male" ? "maleButton": "femaleButton").checked = true;
        document.getElementById(orientation === "homo" ? "homoButton": "heteroButton").checked = true;
        if (orientation === "bi")
            document.getElementById("biButton").checked = true;
    });
    const user = useSelector((state) => state.user.user);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.sex);
    const [orientation, setOrientation] = useState(user.sex_orientation);
    const [bio, setBio] = useState(user.bio);
    console.log(user);
    console.log(first_name);
    console.log(last_name);
    console.log(email);
    console.log(gender);
    console.log(orientation);
    console.log(bio);

    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar/>
                <div className='mx-2 pt-16 h-full'>
					<SettingsHeader/>
                    <div className='flex gap-4 h-full mt-2 sm:mx-40'>
                        <SettingsMenu/>
                        <div className='text-white bg-chess-dark p-4 rounded-lg w-full'>
						    <div className='relative text-white bg-chess-dark p-4 rounded-lg w-full'>
                                <span className='font-bold'>Profile</span>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        First Name
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="currentFirstName"
                                            default={user.first_name}
                                            value={first_name}
                                            placeholder={user.first_name}
                                            onChange={(event) => setFirstName(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        Last Name
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="currentFirstName"
                                            default={user.last_name}
                                            value={last_name}
                                            placeholder={user.last_name}
                                            onChange={(event) => setLastName(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        E-mail
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="currentFirstName"
                                            default={user.email}
                                            value={email}
                                            placeholder={user.email}
                                            onChange={(event) => setEmail(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        Gender
                                    </label>
                                    <label className="text-white text-sm self-start">
                                        Male
                                    </label>
                                    <input id="maleButton" type="radio" name="radio-gender" class="radio radio-primary" onChange={() => setGender("male")} />
                                    <label className="text-white text-sm self-start">
                                        Female
                                    </label>
                                    <input id="femaleButton" type="radio" name="radio-gender" class="radio radio-primary" onChange={() => setGender("female")} />
                                </div>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        Sexual orientation
                                    </label>
                                    <label className="text-white text-sm self-start">
                                        Homosexual
                                    </label>
                                    <input id="homoButton" type="radio" name="radio-sexual" class="radio radio-primary" onChange={() => setOrientation("homo")} />
                                    <label className="text-white text-sm self-start">
                                        Heterosexual
                                    </label>
                                    <input id="heteroButton" type="radio" name="radio-sexual" class="radio radio-primary" onChange={() => setOrientation("hetero")} />
                                    <label className="text-white text-sm self-start">
                                        Bisexual
                                    </label>
                                    <input id="biButton" type="radio" name="radio-sexual" class="radio radio-primary" onChange={() => setOrientation("bi")} />
                                </div>
                                <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="text-white text-sm self-start">
                                        E-mail
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="currentFirstName"
                                            default={user.bio}
                                            value={bio}
                                            placeholder={user.bio}
                                            onChange={(event) => setBio(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
						</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;