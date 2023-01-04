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
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from "../../userSlice";

const Settings = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.sex);
    const [orientation, setOrientation] = useState(user.sex_orientation);
    const [bio, setBio] = useState(user.bio);
    const [interests, setInterests] = useState(user.interests);
    const [newInterest, setNewInterest] = useState('');

    const handleDelete = (tag) => {
        console.info('You clicked the delete icon.');
        var array = [...interests]; // make a separate copy of the array
        var index = array.indexOf(tag)
        if (index !== -1) {
            array.splice(index, 1);
            setInterests(array);
  }
    };

    const addInterest = () => {
        console.info('You clicked the add interest and want to add:', newInterest);
        if(newInterest !== '')
            setInterests((prevInterests) => [...prevInterests, newInterest]);
    };

    const saveToRedux = (data) => {
      const user = jwt_decode(data);
      console.log('redux save', user);
      dispatch(setUser(user));
    }

    const updateUser = () => {
        console.log('gonna updateUser');
        axios.put(`http://localhost:3001/users/${user.id}/update`, {
            first_name:first_name,
            last_name:last_name,
            email:email,
            sex:gender,
            sex_orientation:orientation,
            interests:interests
        })
            .then(response => {
                console.log(response);
                saveToRedux(response.data)
            })
            .catch(error => {
                console.log(error);
            });
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
                                            <FormControlLabel labelPlacement="start" value="male" control={<Radio
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
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64 h-fit'>
                                            <TextField
                                                className='grow'
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
                                    <div className='flex flex-col'>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64 self-end'>
                                                <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                                    placeholder="Add interest..."
                                                    onChange={(event) => setNewInterest(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.keyCode === 13) {
                                                            addInterest();
                                                            event.target.value = '';
                                                        }
                                                    }}/>

                                                <button>
                                                    <PlusIcon onClick={(event) => addInterest()} className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`}/>
                                                </button>
                                        </div>
                                        <div className='w-64'>
                                        {interests.map((tag, index) => (
                                                <Chip
                                                    label={tag}
                                                    size="small"
                                                    color="primary"
                                                    onDelete={(event) => handleDelete(tag)}
                                                    className="bg-orange-300 text-chess-default mr-1"
                                                    sx={{
                                                        '& .MuiChip-deleteIcon, .MuiChip-deleteIcon:hover': {
                                                            color: '#312e2b',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </div>


                                    </div>


                                </div>

                                <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                    <label className="text-white text-sm self-start mb-2">
                                        Pictures
                                    </label>
                                </div>
                                <button onClick={updateUser} className={`btn btn-sm mt-auto rounded-md w-fit bg-green-600 hover:bg-green-500`}>Update</button>
                                </div>
                            </div>
						</div>
                    </div>
                </div>
        </>
    )
}

export default Settings;