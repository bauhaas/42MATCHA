import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { getUserById, blockUserById } from '../../../api';
import { useSelector } from 'react-redux';

const ProfileDetails = ({id}) => {

    const [user, setUser] = useState({});
    const currentUser = useSelector((state) => state.user);

    useEffect(() => {
        console.log('get user ', id);

        const getUser= async() => {
            const response = await getUserById(id);
            setUser(response);
        }
        getUser();
    }, [id]);

    const blockUser = async () => {
       const result = await blockUserById(currentUser.id, user.id);
       console.log(result);
    }

    return (
        <>
            <div className='mx-2 pt-16 h-full'>
                <div className='mx-4 my-2 rounded-lg bg-chess-dark text-white'>
                    <p>Profile of {user.first_name} {user.last_name}</p>
                    <div className="tooltip" data-tip="Block">
                        <NoSymbolIcon onClick={blockUser}  className='h-6 w-6 text-red-500 hover:text-red-700 hover:cursor-pointer' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileDetails;