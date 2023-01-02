import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { HeartIcon as HeartOutlineIcon, NoSymbolIcon} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, ExclamationCircleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

import { getUserById, blockUserById, likeUserById, unlikeUserById } from '../../../api';
import axios from 'axios';

//TODO when match happend, add animation
const ProfileDetails = ({id}) => {

    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const [isMatched, setIsMatched] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [filledIcon, setFilledIcon] = useState(false);
    const [user, setUser] = useState({});

    const blockUser = async () => {
        await blockUserById(currentUser.id, user.id);
    }

    const likeUser = async (event) => {
        await likeUserById(currentUser.id, user.id);
        setFilledIcon(true);
    }

    const unlikeUser = async (event) => {
        await unlikeUserById(currentUser.id, user.id);
        setFilledIcon(false);
    }

    const gotochat = async (event) => {
        axios.post('http://localhost:3001/conversations', {
            userId1: currentUser.id,
            userId2: user.id
        })
            .then(response => {
                console.log(response.data);
                navigate(`/chat/${response.data.id}`, {
                    state: {
                        conv: response.data,
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        const isUserLiked = async () => {
            axios.get(`http://localhost:3001/relations/${currentUser.id}/liked`)
                .then(response => {
                    const likedUsers = response.data;
                    const userExists = likedUsers.find(likedUser => likedUser.receiver_id == id);
                    if (userExists)
                    {
                        console.log('i like him');
                        setFilledIcon(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

        const isUserMatched = async () => {
            axios.get(`http://localhost:3001/relations/${currentUser.id}/matched`)
                .then(response => {
                    const matchedUsers = response.data;
                    const isMatch = matchedUsers.find(matchedUser => matchedUser.receiver_id == id);
                    if (isMatch)
                    {
                        setIsMatched(true);
                        setFilledIcon(true);
                        console.log('you have a match with it');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

        const currentUserIsBlocked = async () => {
            axios.get(`http://localhost:3001/relations/${id}/blocked`)
                .then(response => {
                    const blockedUsers = response.data;
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

        if(currentUser.id !== Number(id))
        {
            isUserLiked();
            isUserMatched();
            currentUserIsBlocked();

            console.log('check if user exist before send a notif');
            if (user && user.id) {
                console.log('send a visit notif to:', user.id, ' from:', currentUser.id);
                sendVisitNotification(currentUser.id, user.id);
            }
        }
    }, [user]);


    const sendVisitNotification = async () => {
            await axios.post('http://localhost:3001/notifications', {
                sender_id: currentUser.id,
                receiver_id: user.id,
                type: 'visit'
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
    }

    useEffect(() => {
        const getUser = async () => {
            console.log('getuser');
            const response = await getUserById(id);
            setUser(response);
        }
        getUser();

        // console.log('check if user exist before send a notif');
        // if (user && user.id) {
        //     console.log('send a visit notif to:', user.id, ' from:', currentUser.id);
        //     sendVisitNotification(currentUser.id, user.id);
        // }
    }, []);

console.log(user);
    // useEffect(() => {
    //     console.log('check if user exist before send a notif');
    //     if (user && user.id) {
    //         console.log('send a visit notif to:', user.id, ' from:', currentUser.id);
    //         sendVisitNotification(currentUser.id, user.id);
    //     }
    // }, [user]);

    // useEffect(() => {
    //     console.log('check if user exist before send a notif');
    //     if(user)
    //     {
    //         console.log('send a visit notif to:', user.id,' from:', currentUser.id);

    //         axios.post('http://localhost:3001/notifications', {
    //             sender_id: currentUser.id,
    //             receiver_id: user.id,
    //             type: 'visit'
    //         })
    //             .then(response => {
    //                 console.log(response.data);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     }
    // }, [user]);


    // useEffect(() => {
    //     socket.client.on('isMatched', (data) => {
    //         console.log(data);
    //     })

    //     return () => {
    //         socket.client.off('isMatched');
    //     };
    // }, []);


    //     useEffect(() => {
    //     socket.client.on('isMatched', (data) => {
    //         console.log(data);
    //     })

    //     return () => {
    //         socket.client.off('isMatched');
    //     };
    // }, []);
    return (
        <>
            <div className='mx-2 pt-16 h-full'>
                <div className='mx-4 my-2 rounded-lg bg-chess-dark text-white'>
                    {
                        blocked
                        ?
                            <div>You have been blocked by that user</div>
                        :
                            <>
                                    <p>Profile of {user.first_name} {user.last_name}</p>
                                    {
                                        currentUser.id !== Number(id)
                                        ?
                                            <>
                                                <div className="tooltip" data-tip="Block">
                                                    <NoSymbolIcon onClick={blockUser} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                                                </div>
                                            {
                                                filledIcon
                                                    ?
                                                    <div className="tooltip" data-tip="Unlike">
                                                        <HeartSolidIcon onClick={(event) => unlikeUser(event)} className='h-6 w-6 text-red-500 hover:text-red-700 hover:cursor-pointer' />
                                                    </div>
                                                    :
                                                    <div className="tooltip" data-tip="Like">
                                                        <HeartOutlineIcon onClick={(event) => likeUser(event)} className='h-6 w-6 text-red-500 hover:text-red-700 hover:cursor-pointer' />
                                                    </div>
                                            }
                                            <div className="tooltip" data-tip="Report">
                                                <ExclamationCircleIcon className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                                            </div>
                                            {
                                                isMatched
                                                    ?
                                                    <div className="tooltip" data-tip="Start chatting">
                                                        <ChatBubbleLeftIcon onClick={(event) => gotochat(event)} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                                                    </div>
                                                    :
                                                    null
                                            }
                                            </>
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