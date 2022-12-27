import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NoSymbolIcon } from '@heroicons/react/24/outline';

import { HeartIcon as HeartOutlineIcon} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';


import { getUserById, blockUserById, likeUserById } from '../../../api';
import { useSelector } from 'react-redux';

const ProfileDetails = ({id}) => {

    const [user, setUser] = useState({});
    const currentUser = useSelector((state) => state.user.user);

    const [filled, setFilled] = useState(false);

    // const toggleFilled = () => {
    //     setFilled(!filled);
    // }

    useEffect(() => {
        console.log('get user ', id);

        const getUser= async() => {
            const response = await getUserById(id);
            setUser(response);
        }
        getUser();
    }, [id]);

    const blockUser = async () => {
        console.log(currentUser.id, user.id);
       const result = await blockUserById(currentUser.id, user.id);
       console.log(result);
    }

    const likeUser = async (event) => {
        console.log(currentUser.id, user.id);
        const result = await likeUserById(currentUser.id, user.id);
        console.log(result);
    }

    const unlikeUser = async (event) => {
        console.log(currentUser.id, user.id);
        // const result = await likeUserById(currentUser.id, user.id);
        // console.log(result);
    }

    console.log(filled);

    return (
        <>
            <div className='mx-2 pt-16 h-full'>
                <div className='mx-4 my-2 rounded-lg bg-chess-dark text-white'>
                    <p>Profile of {user.first_name} {user.last_name}</p>
                    <div className="tooltip" data-tip="Block">
                        <NoSymbolIcon onClick={blockUser}  className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                    </div>
                            {filled ? (
                            <div className="tooltip" data-tip="Unlike">
                            <HeartSolidIcon onClick={(event) => unlikeUser(event)} className='h-6 w-6 text-red-500 hover:text-red-700 hover:cursor-pointer' />
                             </div>

                            ) : (
                                <div className="tooltip" data-tip="Like">
                                <HeartOutlineIcon onClick={(event) => likeUser(event)} className='h-6 w-6 text-red-500 hover:text-red-700 hover:cursor-pointer' />
                                </div>
                            )}
                </div>
            </div>
        </>
    )
}

export default ProfileDetails;