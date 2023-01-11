import React from 'react';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import { PlusIcon } from '@heroicons/react/24/outline';

const InterestsForm = ({ interests, setInterests }) => {

    const [example, setExample] = useState([]);
    const [newInterest, setNewInterest] = useState('');

    function addToInterests(event, interest) {
        event.preventDefault();
        if (interests.includes(interest) === false) {
            setInterests((prevInterests) => [...prevInterests, interest]);
        }
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
        if (newInterest !== '' && interests.includes(newInterest) === false)
            setInterests((prevInterests) => [...prevInterests, newInterest]);
    };

    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-4 gap-2'>
                <p className=' mt-10 font-bold text-2xl'>Add some of your hobbies</p>
                <p className='text-sm text-center'>Others users can quickly see if you have common interests</p>
                <div className='flex gap-2 mt-2'>
                    <input className={` text-white bg-chess-placeholder rounded-lg leading-tight focus:outline-none peer focus:border-2 max-w-xs px-2`} type="text" placeholder="Cinema..."
                        onChange={(event) => setNewInterest(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                                addInterest();
                                event.target.value = '';
                            }
                        }} />
                    <button>
                        <PlusIcon onClick={(event) => addInterest()} className={` h-6 w-6 p-1 text-chess-place-text hover:text-white`} />
                    </button>
                </div>
                <br />
                <div className={`bg-chess-dark rounded-lg p-4 my-4 mx-4 w-full ${interests.length > 0 ? null : 'hidden'}`}>
                    <div className='font-bold text-xl text-center'>Your interests</div>
                    <br />
                    <ul className="flex gap-2 justify-center flex-wrap cursor-pointer">
                        {interests.map((tag, index) => (
                            <Chip
                                key={tag + index}
                                label={tag}
                                size="small"
                                color="primary"
                                onDelete={(event) => handleDelete(tag)}
                                className="bg-orange-300 text-chess-default m-1"
                                sx={{
                                    '& .MuiChip-deleteIcon, .MuiChip-deleteIcon:hover': {
                                        color: '#312e2b',
                                    },
                                }}
                            />
                        ))}
                    </ul>

                </div>
                <p className='font-bold text-2xl'>Out of ideas ? </p>
                <div className='bg-chess-dark rounded-lg p-4 my-4 mx-4 w-full'>
                    <div className='font-bold text-xl text-center'>Popular point of interests</div>
                    <p className='text-center'>Click to add them to your profile</p>
                    <br />
                    <ul className="flex gap-2 justify-center flex-wrap cursor-pointer">
                        {example.map((interest, index) => (
                            <li key={`${interest}-${index}`} id={interest} className="flex">
                                <div onClick={(event) => addToInterests(event, interest)} className="badge badge-lg bg-orange-300 text-chess-default hover:bg-orange-400">{interest}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default InterestsForm;