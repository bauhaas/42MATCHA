import React from 'react';
import { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { grey, deepOrange } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const PreferencesForm = ({age, setAge, sex, setSex, sexOrientation, setSexOrientation, city, setCity, country, setCountry, job, setJob }) => {
    const ageRange = Array.from({ length: 99 - 18 + 1 }, (_, i) => 18 + i);
    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-2 sm:justify-center'>

                <div className='flex flex-col sm:flex-row justify-between  w-1/2'>
                    <label className="text-white text-sm sm:self-center">
                        Age
                    </label>
                    <FormControl >
                        <Select
                            className='text-white border-chess-place-text border-2 h-7'
                            labelId="age-label"
                            id="age-select"
                            value={age}
                            onChange={(event) => setAge(event.target.value)}
                        >
                            <MenuItem value="0">
                                <em>None</em>
                            </MenuItem>
                            {ageRange.map(ageOption => (
                                <MenuItem key={ageOption} value={ageOption}>{ageOption}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className='flex flex-col sm:flex-row justify-between  w-1/2'>
                    <label className="text-white text-sm sm:self-center">
                        Gender
                    </label>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={sex}
                            onChange={(event) => setSex(event.target.value)}
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
                <div className='flex flex-col sm:flex-row justify-between  w-1/2'>
                    <label className="text-white text-sm sm:self-center">
                        Orientation
                    </label>
                    <FormControl>
                        <RadioGroup
                            row
                            value={sexOrientation}
                            onChange={(event) => setSexOrientation(event.target.value)}
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

                <div className='flex flex-col w-1/2 h-full'>
                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                        <label className="text-white text-sm self-start">
                            Country
                        </label>
                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                value={country}
                                onChange={(event) => setCountry(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                        <label className="text-white text-sm self-start">
                            City
                        </label>
                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                        <label className="text-white text-sm self-start">
                            Job
                        </label>
                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                value={job}
                                onChange={(event) => setJob(event.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default PreferencesForm;