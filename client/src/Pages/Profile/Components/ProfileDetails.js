import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { getUserById, blockUser } from '../../../api';


const ProfileDetails = ({id}) => {

    const [user, setUser] = useState({});

    useEffect(() => {
        console.log('get user ', id);

        const getUser= async() => {
            const response = await getUserById(id);
            setUser(response);
        }
        getUser();
    }, [id]);

    return (
        <>
            <div className='mx-2 pt-16 h-full'>
                <div className='mx-4 my-2 rounded-lg bg-chess-dark text-white'>
                    <p>Profile of {user.first_name} {user.last_name}</p>
                    <div className="tooltip" data-tip="Block">
                        <NoSymbolIcon className='h-6 w-6 text-red-500' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileDetails;