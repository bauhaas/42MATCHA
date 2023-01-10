import React from 'react';
import { useEffect, useState } from 'react';

const PreferencesForm = ({  setAge, setSex, setSexOrientation }) => {
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

    return (
        <>
            <div className='min-h-screen flex flex-col items-center justify-center px-2 gap-2'>
                <div className='font-bold text-2xl'>What's your age ?</div>
                <div className=''>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-16">
                            <span className="label-text font-bold">Male</span>
                            <input
                                type='number'
                                default={18}
                                onChange={(event) => {
                                    if (event.target.value >= 18)
                                        setAge(event.target.value)
                                    }} />
                        </label>
                    </div>
                </div>
                <div className='font-bold text-2xl'>You are </div>
                <div className=''>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-16">
                            <span className="label-text font-bold">Male</span>
                            <input
                                type="radio"
                                name="radio-sex"
                                value="male"
                                className="radio checked:bg-blue-500"
                                checked={selectedSex === 'male'}
                                onChange={handleSexChange}
                            />
                        </label>
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
                </div>
                <div className='font-bold text-2xl'>You are interested by</div>
                <div className=''>
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
                </div>
            </div>
        </>
    );
}

export default PreferencesForm;