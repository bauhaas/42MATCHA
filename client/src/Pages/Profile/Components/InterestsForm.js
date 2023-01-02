import React from 'react';
import { useEffect, useState } from 'react';

const InterestsForm = ({ interests, setInterests }) => {

    const [example, setExample] = useState([]);

    function addToInterests(event, interest) {
        event.preventDefault();
        setInterests((prevInterests) => [...prevInterests, interest]);
    }

    //random test data
    useEffect(() => {
        setExample(
            [
                "cinema",
                "test",
                "sport",
                "42",
                "party",
                "games",
                "swimming",
                "football",
                "paint",
                "museums",
                "beer",
                "restaurants",
                "travel",
                "food"
            ]
        );
    }, [])

    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-4 gap-2'>
                <p className=' mt-10 font-bold text-2xl'>Add some of your hobbies</p>
                <p className='text-sm text-center'>Others users can quickly see if you have common interests</p>
                <div className='flex gap-2 mt-2'>
                    <input className={`shadow border rounded-lg leading-tight focus:outline-none max-w-xs px-2`} type="text" placeholder="Cinema..." />
                    <button className="btn btn-sm gap-2">
                        ADD
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
                <br />
                <p className='font-bold text-2xl'>Out of ideas ? </p>
                <div className='bg-emerald-800 rounded-lg p-4 my-4 mx-4'>
                    <div className='font-bold text-xl text-center'>Popular point of interests</div>
                    <p className='text-center'>Click to add them to your profile</p>
                    <br />
                    <ul className="flex gap-2 justify-center flex-wrap">
                        {example.map((interest, index) => (
                            <li key={`${interest}-${index}`} id={interest} className="flex">
                                <div onClick={(event) => addToInterests(event, interest)} className="badge badge-lg bg-emerald-300 text-black hover:text-white hover:bg-indigo-700">{interest}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default InterestsForm;