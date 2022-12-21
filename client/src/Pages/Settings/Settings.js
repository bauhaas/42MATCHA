import React, { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import SettingsMenu from './Components/SettingsMenu';
import SettingsProfile from './Components/SettingsProfile';
import axios from 'axios';
import SettingsHeader from './Components/SettingsHeader';

const Settings = () => {

    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar/>
                <div className='mx-2 pt-16 h-full'>
					<SettingsHeader/>
                    <div className='flex gap-4 h-full mt-2 sm:mx-40'>
                        <SettingsMenu/>
                        <div className='text-white bg-chess-dark p-4 rounded-lg w-full'>
							<span className='font-bold'>Profile</span>
						</div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Settings;