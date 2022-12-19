import React from 'react';
import { useEffect, useState } from 'react';

const PreferencesForm = ({ setSexOrientation }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSexOrientation(event.target.value);
    };

    console.log(selectedOption);

    return (
        <>
            <div className='min-h-screen flex flex-col items-center justify-center px-2 gap-2'>
                <div className='font-bold text-2xl'>You are interested by</div>
                <div className=''>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-16">
                            <span className="label-text font-bold">Male</span>
                            <input
                                type="radio"
                                name="radio-10"
                                value="male"
                                className="radio checked:bg-blue-500"
                                checked={selectedOption === 'male'}
                                onChange={handleOptionChange}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-bold">Female</span>
                            <input
                                type="radio"
                                name="radio-10"
                                value="female"
                                className="radio checked:bg-blue-500"
                                checked={selectedOption === 'female'}
                                onChange={handleOptionChange}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-bold">Both</span>
                            <input
                                type="radio"
                                name="radio-10"
                                value="both"
                                className="radio checked:bg-blue-500"
                                checked={selectedOption === 'both'}
                                onChange={handleOptionChange}
                            />
                        </label>
                    </div>
                </div>

            </div>

        </>
    );
}

export default PreferencesForm;