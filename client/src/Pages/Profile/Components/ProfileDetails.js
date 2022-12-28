import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { HeartIcon as HeartOutlineIcon, NoSymbolIcon} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, ExclamationCircleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

import { getUserById, blockUserById, likeUserById, unlikeUserById } from '../../../api';
import axios from 'axios';

//TODO when match happend, add animation
//TODO when match happend, atm, it's removed from liked. So need more update to have hearfillicon
const ProfileDetails = ({id}) => {

    const currentUser = useSelector((state) => state.user.user);

    const [isMatched, setIsMatched] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [filled, setFilled] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser= async() => {
            const response = await getUserById(id);
            setUser(response);
        }
        getUser();

        const isUserLiked = async () => {
            console.log(currentUser.id);
            axios.get(`http://localhost:3001/users/${currentUser.id}/liked`)
                .then(response => {
                    const likedUsers = response.data;
                    const userExists = likedUsers.find(likedUser => likedUser.id == id);
                    if (userExists)
                        setFilled(true);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        isUserLiked();

        const isUserMatched = async () => {
            console.log(currentUser.id);
            axios.get(`http://localhost:3001/users/${currentUser.id}/matched`)
                .then(response => {
                    const matchedUsers = response.data;
                    console.log(matchedUsers);
                    const isMatch = matchedUsers.find(matchedUser => matchedUser.id == id);

                    if (isMatch)
                    {
                        setIsMatched(true);
                        console.log('you have a match with it');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        isUserMatched();

        const currentUserIsBlocked = async () => {
            console.log(currentUser.id);
            axios.get(`http://localhost:3001/block/${id}`)
                .then(response => {
                    const blockedUsers = response.data;
                    console.log(blockedUsers);
                    const userExists = blockedUsers.find(user => user.blocked_id == currentUser.id);
                    if (userExists)
                    {
                        setBlocked(true);
                        console.log('im blocked by him');
                    }
                    else
                        console.log('im not blocked by him');
                })
                .catch(error => {
                    console.log(error);
                });
        }
        currentUserIsBlocked();
    }, [id]);

    const blockUser = async () => {
       await blockUserById(currentUser.id, user.id);
    }

    const likeUser = async (event) => {
        await likeUserById(currentUser.id, user.id);
        setFilled(true);
    }

    const unlikeUser = async (event) => {
        await unlikeUserById(currentUser.id, user.id);
        setFilled(false);
    }

    const gotochat = async (event) => {
       axios.post('http://localhost:3001/conversations', {
            userId1: currentUser.id,
            userId2: user.id
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
        // navigate(`/chat/${convName}`);
    }

    return (
        <>
            <div className='mx-2 pt-16 h-full'>
                <div className='mx-4 my-2 rounded-lg bg-chess-dark text-white'>
                    {blocked ?
                        <div>
                           You have been blocked by that user
                        </div>
                    :
                    <>
                            <p>Profile of {user.first_name} {user.last_name}</p>
                            <div className="tooltip" data-tip="Block">
                                <NoSymbolIcon onClick={blockUser} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
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
                            <div className="tooltip" data-tip="Report">
                                <ExclamationCircleIcon className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                            </div>
                            {
                                isMatched ?
                                <div className="tooltip" data-tip="Start chatting">
                                    <ChatBubbleLeftIcon onClick={(event) => gotochat(event)} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                                </div>
                                :
                                null
                            }

                    </>
                    }

                </div>
            </div>
        </>
    )
}

export default ProfileDetails;