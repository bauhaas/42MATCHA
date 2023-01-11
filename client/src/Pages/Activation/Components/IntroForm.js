import React from 'react';

const IntroForm = () => {
    return (
        <>
            <div className='min-h-screen flex flex-col items-center px-2 gap-2'>
                    <img className="h-32 w-32 mt-8" src="../logo.png" alt="logo"></img>
                    <div className='font-bold text-3xl'>Welcome on Matcha</div>
                    <p className='mt-8 text-center'>Before looking for your next partner, let's complete your profile</p>
                    <p className='mt-4 text-center'>The more you will add informations, the more you can expect people visiting your profile</p>
            </div>
        </>
    );
}

export default IntroForm;