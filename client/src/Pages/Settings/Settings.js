import React, { useState, useRef } from 'react';
import SettingsMenu from './Components/SettingsMenu';
// import axios from 'axios';
import api from '../../ax';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { grey, deepOrange } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { removeFile, setFiles, setUser, updateFiles } from "../../userSlice";
import SettingsPageLayout from './Components/SettingsPageLayout';
import FormField from '../../SharedComponents/FormField';

const Settings = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const user = useSelector((state) => state.user.user);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.sex);
    const [orientation, setOrientation] = useState(user.sex_orientation);
    const [bio, setBio] = useState(user.bio);
    const [age, setAge] = useState(user.age);
    const [interests, setInterests] = useState(user.interests);
    const [newInterest, setNewInterest] = useState('');
    
    const handleDelete = (tag) => {
        var array = [...interests]; // make a separate copy of the array
        var index = array.indexOf(tag)
        if (index !== -1) {
            array.splice(index, 1);
            setInterests(array);
        }
    };

    const addInterest = () => {
        if(newInterest !== '' && interests.includes(newInterest) === false)
            setInterests((prevInterests) => [...prevInterests, newInterest]);
    };

    const updateUser = () => {
        console.log('gonna updateUser');
        api.put(`http://localhost:3001/users/${user.id}/update`, {
            first_name:first_name,
            last_name:last_name,
            email:email,
            sex:gender,
            sex_orientation:orientation,
            interests:interests,
            bio:bio,
            age:age
        })
            .then(response => {
                console.log(response);
                dispatch(setUser(response.data));
            })
            .catch(error => {
                console.log(error);
            });
    };


    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('userId', user.id);
                formData.append('is_profile_pic', false);
                api.post(`http://localhost:3001/users/${user.id}/upload`, formData, {
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
    };

    const deleteImage = (event, file) => {
        event.preventDefault();
        if(user.files.length === 1)
            return;
        api.delete(`http://localhost:3001/users/files/${file.id}/${user.id}`)
            .then(response => {
                dispatch(removeFile(file));
            })
            .catch((error) => {
                console.error(error);
            })
    };

    const setAsProfilePic = (event, file) => {
        event.preventDefault();
        api.put(`http://localhost:3001/users/setAsProfilePic/${file.id}`, {
            userId : user.id
        })
            .then(response => {
                dispatch(setFiles(response.data));
            })
            .catch((error) => {
                console.error(error);
            })
    };

    const fields = [
        { label: "First name", defaultValue: user.first_name, value: first_name, onChange: (event) => setFirstName(event.target.value) },
        { label: "Last name", defaultValue: user.last_name, value: last_name, onChange: (event) => setLastName(event.target.value) },
        { label: "Email", defaultValue: user.email, value: email, onChange: (event) => setEmail(event.target.value) },
        { label: "Age", defaultValue: user.age, value: age, onChange: (event) => setAge(event.target.value) }
      ];

    return (
        <>
            <SettingsPageLayout>
                <SettingsMenu />
                <div className='flex flex-col w-full max-w-3xl p-4 text-white rounded-lg bg-chess-dark'>
                    <span className='font-bold'>Profile</span>
                    <div className='flex flex-col w-3/4 h-full'>

                        {fields.map((field, index) => (
                            <FormField
                                key={field.label + index}
                                label={field.label}
                                value={field.value}
                                placeholder={field.defaultValue}
                                onChange={field.onChange}
                            />
                        ))}

                        <div className='flex flex-col sm:flex-row sm:justify-between'>
                            <label className="text-sm text-white sm:self-center">
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
                                    />} label="Male"
                                        className='grow' />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:justify-between'>
                            <label className="text-sm text-white sm:self-center grow">
                                Orientation
                            </label>
                            <FormControl>
                                <RadioGroup
                                    row
                                    value={orientation}
                                    onChange={(event) => setOrientation(event.target.value)}
                                >
                                    <FormControlLabel labelPlacement="start" value="hetero" control={<Radio
                                        sx={{
                                            '&.MuiRadio-root': {
                                                color: grey[600],
                                            },
                                            '&.Mui-checked': {
                                                color: deepOrange[200],
                                            },
                                        }} />} label="Hetero" />
                                    <FormControlLabel labelPlacement="start" value="homo" control={<Radio
                                        sx={{
                                            '&.MuiRadio-root': {
                                                color: grey[600],
                                            },
                                            '&.Mui-checked': {
                                                color: deepOrange[200],
                                            },
                                        }} />} label="Homo" className='grow' />
                                    <FormControlLabel labelPlacement="start" value="bi" control={<Radio
                                        sx={{
                                            '&.MuiRadio-root': {
                                                color: grey[600],
                                            },
                                            '&.Mui-checked': {
                                                color: deepOrange[200],
                                            },
                                        }} />} label="Bi"
                                        className='grow'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className='flex flex-col mt-2 mb-2 sm:flex-row sm:justify-between'>
                            <label className="self-start text-sm text-white">
                                Bio
                            </label>
                            <div className='flex flex-row pl-2 rounded-sm bg-chess-placeholder sm:w-64 h-fit'>
                                <TextField
                                    className='grow'
                                    multiline
                                    rows={10}
                                    value={bio}
                                    onChange={(event) => setBio(event.target.value)}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none'
                                            },
                                            '&:hover fieldset': {
                                                border: 'none'
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none'
                                            },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mt-2 mb-2 sm:flex-row sm:justify-between'>
                            <label className="self-start text-sm text-white">
                                Interests
                            </label>
                            <div className='flex flex-col'>
                                <div className='flex flex-row pl-2 mb-2 rounded-sm bg-chess-placeholder sm:w-64 h-fit'>
                                    <input className="w-full text-white bg-transparent focus:outline-none focus:shadow-outline" id="currentPass"
                                        placeholder="Add interest..."
                                        onChange={(event) => setNewInterest(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.keyCode === 13) {
                                                addInterest();
                                                event.target.value = '';
                                            }
                                        }} />
                                    <button>
                                        <PlusIcon onClick={(event) => addInterest()} className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`} />
                                    </button>
                                </div>
                                <div className='w-64'>
                                    {interests.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            color="primary"
                                            onDelete={(event) => handleDelete(tag)}
                                            className="m-1 bg-orange-300 text-chess-default"
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
                        <button onClick={updateUser} className={`btn btn-sm mt-auto rounded-md w-fit bg-green-600 hover:bg-green-500`}>Update</button>
                        <div className="divider before:bg-chess-bar after:bg-chess-bar"></div>
                        <div className='flex flex-col mt-2 mb-2 sm:flex-row sm:justify-between'>
                            <label className="self-start mb-2 text-sm text-white">
                                Pictures
                            </label>
                            <div className='flex flex-col'>
                                <input
                                    type="file"
                                    className="w-full max-w-xs rounded-sm file-input file-input-sm bg-chess-placeholder sm:w-64"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                />
                                <div className='w-64'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2'>
                                        {user.files && user.files.map((file, index) => (
                                            <div key={index} className='relative m-2 rounded-lg group'>
                                                <button onClick={(event) => deleteImage(event, file)} className="absolute right-0 invisible m-2 btn btn-circle btn-xs group-hover:visible">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <button onClick={(event) => setAsProfilePic(event, file)} className={`rounded-b-lg absolute bottom-0 left-0 w-full text-center text-xs py-1 bg-orange-300 text-black invisible  ${file.is_profile_pic === true ? null : 'group-hover:visible'} `}>
                                                    set as profile pic</button>
                                                <img className={`aspect-square h-full w-full rounded-lg ${file.is_profile_pic === true ? 'border-2 border-orange-300' : null}`} src={`http://localhost:3001/${file.file_path}`} alt="uploaded file" />

                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </SettingsPageLayout>
        </>
    )
}

export default Settings;