import React, { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { NoSymbolIcon, KeyIcon, HeartIcon, UserIcon, UsersIcon, Cog6ToothIcon,  } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import SettingsMenu from './Components/SettingsMenu';

const Settings = () => {

    const navigate = useNavigate();

    function gotoRoute(route) {
      navigate(`/settings/${route}`);
    }

    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar/>
                <div className='mx-2 pt-16 h-screen'>
                    <div className='flex items-center text-white font-bold text-2xl'>
                        <Cog6ToothIcon className={`h-6 w-6 align-middle`}/>
                        <span className="align-middle">Settings</span>
                    </div>
                    <div className='flex gap-4'>
                        <SettingsMenu/>
                        <div className='bg-red-400 grow rounded-lg'>
                           Profile
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;