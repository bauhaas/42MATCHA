import React, { useState, useEffect } from 'react';
import NavBar from '../Navbar/NavBar';
import SettingsMenu from './Components/SettingsMenu';
import axios from 'axios';
import SettingsHeader from './Components/SettingsHeader';
import { useSelector } from 'react-redux';
import SettingsLayout from './Components/SettingsLayout';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { useRadioGroup } from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { grey, deepOrange } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const Settings = () => {

    const user = useSelector((state) => state.user.user);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.sex);
    const [orientation, setOrientation] = useState(user.sex_orientation);
    const [bio, setBio] = useState(user.bio);
    const [interests, setInterests] = useState(user.interests);

    console.log(orientation, gender, interests);

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    return (
        <>
            <div className="bg-chess-default min-h-screen overflow-y-auto">
                <NavBar/>
                <div className='mx-2 pt-16 h-screen'>
					<SettingsHeader/>
                    <div className='flex gap-4 mt-2'>
                        <SettingsMenu/>
                            <div className=' text-white bg-chess-dark p-4 rounded-lg w-full max-w-3xl flex flex-col'>
                                <span className='font-bold'>Profile</span>
                                <div className='flex flex-col w-3/4 h-full'>
                                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                        <label className="text-white text-sm self-start">
                                            First name
                                        </label>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                                default={user.first_name}
                                                value={first_name}
                                                placeholder={user.first_name}
                                                onChange={(event) => setFirstName(event.target.value)}/>
                                        </div>
                                    </div>

                                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                        <label className="text-white text-sm self-start">
                                            Last name
                                        </label>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                                default={user.last_name}
                                                value={last_name}
                                                placeholder={user.last_name}
                                                onChange={(event) => setLastName(event.target.value)} />
                                        </div>
                                    </div>

                                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                        <label className="text-white text-sm self-start">
                                           Email
                                        </label>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                                default={user.email}
                                                value={email}
                                                placeholder={user.email}
                                                onChange={(event) => setEmail(event.target.value)} />
                                        </div>
                                    </div>

                                <div className='flex flex-col sm:flex-row  sm:justify-between'>
                                        <label className="text-white text-sm sm:self-center">
                                            Gender
                                        </label>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={gender}
                                                onChange={(event) => setGender(event.target.value)}
                                            >
                                            <FormControlLabel labelPlacement="start" value="female" control={<Radio
                                                sx={{
                                                    '&.MuiRadio-root': {
                                                        color: grey[600],
                                                    },
                                                    '&.Mui-checked': {
                                                        color: deepOrange[200],
                                                    },
                                                }} />} label="Female" />
                                            <FormControlLabel labelPlacement="start" value="man" control={<Radio
                                                sx={{
                                                    '&.MuiRadio-root': {
                                                        color: grey[600],
                                                    },
                                                    '&.Mui-checked': {
                                                        color: deepOrange[200],
                                                    },
                                                }}
                                                />} label="Male" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>

                                <div className='flex flex-col sm:flex-row sm:justify-between'>
                                        <label className="text-white text-sm sm:self-center grow">
                                            Orientation
                                        </label>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={orientation}
                                                onChange={(event) => setOrientation(event.target.value)}
                                            >
                                            <FormControlLabel labelPlacement="start"  value="hetero" control={<Radio
                                                sx={{
                                                    '&.MuiRadio-root': {
                                                        color: grey[600],
                                                    },
                                                    '&.Mui-checked': {
                                                        color: deepOrange[200],
                                                    },
                                                }} />} label="Hetero" />
                                            <FormControlLabel labelPlacement="start"  value="homo" control={<Radio
                                                sx={{
                                                    '&.MuiRadio-root': {
                                                        color: grey[600],
                                                    },
                                                    '&.Mui-checked': {
                                                        color: deepOrange[200],
                                                    },
                                                }} />} label="Homo" />
                                            <FormControlLabel labelPlacement="start"  value="bi" control={<Radio
                                                sx={{
                                                    '&.MuiRadio-root': {
                                                        color: grey[600],
                                                    },
                                                    '&.Mui-checked': {
                                                        color: deepOrange[200],
                                                    },
                                                }} />} label="Bi" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>

                                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                        <label className="text-white text-sm self-start">
                                            Bio
                                        </label>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64 h-80'>
                                            <TextField
                                                multiline
                                                rows={10}
                                                defaultValue={user.bio}

                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            border:'none'
                                                        },
                                                        '&:hover fieldset': {
                                                            border:'none'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border:'none'
                                                        },
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                    <label className="text-white text-sm self-start mb-2">
                                        Interests
                                    </label>
                                    {interests.map((tag, index) => (
                                        // <div className='badge relative group'>
                                        //     {tag}
                                        //     <button className="invisible group-hover:visible flex justify-center items-center h-3 w-3 absolute bottom-3 bg-red-500 right-0 rounded-full">
                                        //         x
                                        //     </button>
                                        // </div>
                                        <Chip
                                            label="Clickable Deletable"
                                            size="small"
                                            color="primary"
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>

                                <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                    <label className="text-white text-sm self-start mb-2">
                                        Pictures
                                    </label>
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