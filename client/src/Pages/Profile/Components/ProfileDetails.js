import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { AiFillFire } from 'react-icons/ai';
import Chip from '@mui/material/Chip';
import axios from 'axios';

import Avatar from "../../../SharedComponents/Avatar";
import InteractionButtons from './InteractionButtons';
import socket from '../../../Context/socket'

const ProfileDetails = ({id}) => {

    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const [isMatched, setIsMatched] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [filledIcon, setFilledIcon] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const isUserLiked = async () => {
            axios.get(`http://localhost:3001/users/${currentUser.id}/liked`)
                .then(response => {
                    const likedUsers = response.data;
                    const userExists = likedUsers.find(likedUser => likedUser.id == id);
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
            axios.get(`http://localhost:3001/users/${currentUser.id}/matched`)
                .then(response => {
                    const matchedUsers = response.data;
                    const isMatch = matchedUsers.find(matchedUser => matchedUser.id == id);
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
            axios.get(`http://localhost:3001/users/${id}/blocked`)
                .then(response => {
                    const blockedUsers = response.data;
                    const userExists = blockedUsers.find(user => user.id == currentUser.id);
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

    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const getUser = async () => {
            await axios.get(`http://localhost:3001/users/${currentUser.id}/profile/${id}`)
                .then(response => {
                    // console.log(response.data);

                    if (response.data.files) {
                        response.data.files.sort((a, b) => {
                            if (a.is_profile_pic === true) {
                                return -1;
                            } else if (b.is_profile_pic === true) {
                                return 1;
                            }
                            return 0;
                        });
                    }

                    setUser(response.data);
                    if(response.data.files && response.data.files.find((file) => file.is_profile_pic === true) )
                        setProfilePic(response.data.files.find((file) => file.is_profile_pic === true).file_path)
                })
                .catch(error => {
                    console.log(error);
                    navigate('/Unknown');
                });
        }
        getUser();
    }, []);

    useEffect(() => {
        socket.client.on('userDisconnect', (data) => {
            if (user.id == data)
            {
                setUser({
                    ...user,
                    status: true,
                });
                console.log('user has disconnect', data)
            }
        })

        socket.client.on('userConnect', (data) => {
            console.log(user.id, data);
            if (user.id == data) {
                console.log('user has connect', data)
                setUser({
                    ...user,
                    status: null,
                });
            }
        })

        return () => {
            socket.client.off('userDisconnect');
            socket.client.off('userConnect');
        };
    });

    return (
        <>
            <div className='mx-2 pt-16 h-screen'>
                <div className='mx-4 my-2 p-2 rounded-lg bg-chess-dark text-white'>
                    {
                        blocked
                        ?
                            <div>You have been blocked by that user</div>
                        :
                            <>
                                    <div className='relative m-2 grid grid-cols-2  sm:flex sm:gap-2'>
                                        <div>
                                        <Avatar imageAttribute={'rounded-full w-30 sm:w-40'} attribute={`avatar`} imagePath={profilePic} from='profiledetails' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                                <p className='text-4xl font-bold text-orange-400'>{user.first_name} {user.last_name}</p>
                                                <div className='absolute top-0 sm:top-auto right-8 sm:right-auto sm:relative sm:ml-auto sm:mb-12 sm:mr-10' >
                                                <AiFillFire className='absolute w-12 h-12 text-center text-red-600'>{" "}</AiFillFire>
                                                <p className='flex absolute text-center pt-2 justify-center items-center  w-12 h-12 text-white'>{user.fame_rating}</p>
                                                </div>
                                            </div>
                                            <p>{user.job}</p>
                                            <p>{user.city}, {user.country}</p>
                                            <p>{user.age} years old</p>
                                            <p>{user.sex_orientation} {user.sex}</p>

                                        </div>
                                        <InteractionButtons user={user} isMatched={isMatched} filled={filledIcon} />
                                    </div>
                                    <div className='bg-chess-button rounded-lg m-2 py-2'>
                                        <h1 className='text-center'>Interests</h1>
                                        <div className='pt-2 flex gap-2 justify-center flex-wrap'>
                                            {user.interests && user.interests.map((interest, index) => (
                                                <Chip key={interest + index} label={interest} className="bg-orange-200" />
                                            ))}
                                        </div>

                                    </div>
                                    <div className='bg-chess-button rounded-lg m-2 py-2'>
                                        <h1 className='text-center'>Bio</h1>
                                        <p className='text-center'>{user.bio}</p>
                                    </div>
                                <div className='bg-chess-button rounded-lg m-2 py-2'>
                                    <h1 className='text-center'>Pictures</h1>
                                    <div className='grid grid-cols-1 sm:grid-cols-2'>
                                        {user.files && user.files.map((file, index) => (
                                            <div key={file.id + index}  className='relative  rounded-lg m-2 border-2 border-orange-300'>
                                                <img className="aspect-square h-full w-full rounded-lg " src={`http://localhost:3001/${file.file_path}`} alt="uploaded file" />
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfileDetails;