import React from 'react';

const BioForm = ({bio, setBio}) => {

    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-4 gap-2'>
                <div className='mt-10 font-bold text-2xl'>Tell us a bit more about you</div>
                <textarea defaultValue={bio} onChange={(event) => setBio(event.target.value)}  className="bg-chess-place-text mt-12  text-black textarea w-full h-80" placeholder="Your bio..."></textarea>
            </div>
        </>
    );
}

export default BioForm;