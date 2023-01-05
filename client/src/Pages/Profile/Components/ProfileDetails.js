import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Chip from '@mui/material/Chip';
import Avatar from "../../../SharedComponents/Avatar";
import axios from 'axios';
import InteractionButtons from './InteractionButtons';
import { AiFillFire } from 'react-icons/ai';

//TODO when match happend, add animation
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
                    setUser(response.data);
                    setProfilePic(response.data.files.find((file) => file.is_profile_pic === true).file_path)
                })
                .catch(error => {
                    console.log(error);
                    navigate('/Unknown');
                });
        }
        getUser();
    }, []);

    console.log(user, user.files, profilePic);
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
                                    <div className='m-2 grid grid-cols-2  sm:flex sm:gap-2'>
                                        <div>
                                        <Avatar imageAttribute={'rounded-full w-30 sm:w-40'} attribute={`avatar`} imagePath={profilePic} from='profiledetails' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                                <p className='text-4xl font-bold text-orange-400'>{user.first_name} {user.last_name}</p>
                                                <div className='flex items-center relative'>
                                                    <p className='absolute ml-3 mt-2'>{user.fame_rating}</p>
                                                    <AiFillFire className='w-9 h-9 text-red-700 bg-transparent'></AiFillFire>
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
                                    {/* <img src={`http://localhost:3001/src/uploads/6d2db3d104176705c313e47f5682399d`} alt="uploaded file" /> */}

                                    <div className='grid grid-cols-1 sm:grid-cols-2 border-4 border-red-600'>
                                        {user.files && user.files.map((file, index) => (
                                            <div key={file.id + index}  className='border-2 border-blue-500'>
                                                <img className="border-2 border-green-500" src={`http://localhost:3001/${file.file_path}`} alt="uploaded file" />
                                            </div>
                                        ))}
                                    </div>
                                    {/* <img src={`http://localhost:3001/uploads/a775b82b668f3ba309e651f57e956302`} alt="uploaded file" /> */}
                                    {/* <div className='grid grid-cols-1 sm:grid-cols-2'>
                                        <div className='border rounded-lg m-2 py-2'>
                                            {user.photos ? <img src={user.photos} alt='user photos'/> : null}
                                        </div>
                                        <div className='border rounded-lg h-80 w-80'>
                                            {user.photos ? <img className='rounded-lg object-fill' src={user.photos} alt='user photos' /> : null}
                                        </div>
                                        <div className='border rounded-lg m-2 py-2'>
                                            {user.photos ? <img src={user.photos} alt='user photos' /> : null}
                                        </div>
                                        <div className='border rounded-lg m-2 py-2'>
                                            {user.photos ? <img src={user.photos} alt='user photos' /> : null}
                                        </div>
                                        <div className='border rounded-lg m-2 py-2'>
                                            {user.photos ? <img src={user.photos} alt='user photos' /> : null}
                                        </div>
                                    </div> */}
                                </div>






                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfileDetails;