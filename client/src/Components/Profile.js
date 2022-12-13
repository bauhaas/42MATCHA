import ActiveConversations from './ActiveConversations';
import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { socket } from '../App';

const Profile = () => {

    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar />
                <div className='text-white text-2xl mt-16'>Profile page</div>
                <ActiveConversations />
            </div>
        </>
    )
}

export default Profile;