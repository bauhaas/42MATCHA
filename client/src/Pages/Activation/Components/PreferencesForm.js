import React from 'react';
import { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { grey, deepOrange } from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     },
//     selectEmpty: {
//         marginTop: theme.spacing(2),
//     },
//     selectMenu: {
//         maxHeight: '20px',
//         overflowY: 'scroll',
//     }
// }));

const PreferencesForm = ({age, setAge, sex, setSex, sexOrientation, setSexOrientation }) => {
    const [selectedSex, setSelectedSex] = useState(null);
    const [selectedOri, setSelectedOri] = useState(null);

    const handleSexChange = (event) => {
        setSelectedSex(event.target.value);
        setSex(event.target.value);
    };

    const handleOriChange = (event) => {
        setSelectedOri(event.target.value);
        setSexOrientation(event.target.value);
    };

    console.log(selectedOri);
    const ageRange = Array.from({ length: 99 - 18 + 1 }, (_, i) => 18 + i);
    return (
        <>
            <div className='min-h-screen flex flex-col items-center justify-center px-2 gap-2'>
                <div className='font-bold text-2xl'>What's your age ?</div>
                <FormControl >
                    <Select
                    className='text-white border-chess-place-text border-2'
                        labelId="age-label"
                        id="age-select"
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {ageRange.map(ageOption => (
                            <MenuItem key={ageOption} value={ageOption}>{ageOption}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className='font-bold text-2xl'>You are </div>
                {/* <div className=''>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-16">
                            <span className="label-text font-bold">Male</span>

                        </label>
                        <input
                            type="radio"
                            name="radio-sex"
                            value="male"
                            className="radio checked:bg-blue-500"
                            checked={selectedSex === 'male'}
                            onChange={handleSexChange}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-bold">Female</span>
                            <input
                                type="radio"
                                name="radio-sex"
                                value="female"
                                className="radio checked:bg-blue-500"
                                checked={selectedSex === 'female'}
                                onChange={handleSexChange}
                            />
                        </label>
                    </div>
                </div> */}
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
                <div className='font-bold text-2xl'>Sexual orientation</div>
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
                {/* <div className=''>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-16">
                            <span className="label-text font-bold">Male</span>
                            <input
                                type="radio"
                                name="radio-ori"
                                value="male"
                                className="radio checked:bg-blue-500"
                                checked={selectedOri === 'male'}
                                onChange={handleOriChange}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-bold">Female</span>
                            <input
                                type="radio"
                                name="radio-ori"
                                value="female"
                                className="radio checked:bg-blue-500"
                                checked={selectedOri === 'female'}
                                onChange={handleOriChange}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-bold">Both</span>
                            <input
                                type="radio"
                                name="radio-ori"
                                value="both"
                                className="radio checked:bg-blue-500"
                                checked={selectedOri === 'both'}
                                onChange={handleOriChange}
                            />
                        </label>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default PreferencesForm;