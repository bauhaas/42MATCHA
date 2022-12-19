import React from 'react';
import { useEffect, useState } from 'react';

const BioForm = ({setBio}) => {

    const [text, setText] = useState("");

    function updateBio(value) {
        setText(value);
    }

    function updateToParent() {
        setBio(text);
    }

    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-4 gap-2'>
                <div className='mt-10 font-bold text-2xl'>Tell us a bit more about you</div>
                <textarea onChange={(event) => updateBio(event.target.value)}  className="mt-12 textarea w-full h-80" placeholder="Your bio..."></textarea>
                <button className='btn w-full bg-indigo-800 hover:bg-indigo-600' onClick={updateToParent}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </button>

        </div>

        </>
    );
}

export default BioForm;