import React from 'react';
import { useState } from 'react';

const BioForm = ({setBio}) => {

    const [text, setText] = useState("");

    const updateBio = (value) => {
        setText(value);
        setBio(text);
    }

    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-4 gap-2'>
                <div className='mt-10 font-bold text-2xl'>Tell us a bit more about you</div>
                <textarea onChange={(event) => updateBio(event.target.value)}  className="mt-12 textarea w-full h-80" placeholder="Your bio..."></textarea>
            </div>
        </>
    );
}

export default BioForm;