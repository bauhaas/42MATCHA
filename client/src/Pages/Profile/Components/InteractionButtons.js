import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { GoPrimitiveDot } from 'react-icons/go';
import { HeartIcon as HeartOutlineIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, ExclamationCircleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import api from '../../../ax';
import { blockUserById, likeUserById, unlikeUserById } from '../../../api';
import socket from '../../../Context/socket'

const InteractionButtons = ({ user, isMatched, filled, setFilledIconp }) => {
    const currentUser = useSelector((state) => state.user.user);
    const [filledIcon, setFilledIcon] = useState(false);
    const [match, setMatch] = useState(false);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();

    const blockUser = async () => {
        await blockUserById(currentUser.id, user.id);
    }

    const likeUser = async (event) => {
        const relation = await likeUserById(currentUser.id, user.id);
        if(relation.type === 'match')
            setMatch(true);
        setFilledIcon(true);
    }

    const unlikeUser = async (event) => {
        await unlikeUserById(currentUser.id, user.id);
        setFilledIcon(false);
        setMatch(false);
        setFilledIconp(false);
    }

    const gotochat = async (event) => {
        await api.get(`http://localhost:3001/conversations/${currentUser.id}/${user.id}`)
            .then(response => {
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
        const lastConnectionDate = new Date(user.status);
        const lastConnectionDateFormatted =
            (lastConnectionDate.getUTCHours() + 1).toString() + ":" +
            ("0" + lastConnectionDate.getUTCMinutes()).slice(-2) + ":" +
            ("0" + lastConnectionDate.getUTCSeconds()).slice(-2) + " " +
            lastConnectionDate.getUTCDate() + "/" +
            ("0" + (lastConnectionDate.getUTCMonth() + 1)).slice(-2) + "/" +
            lastConnectionDate.getUTCFullYear();
        setDate(lastConnectionDateFormatted);

    }, [user])


    useEffect(() => {
        socket.client.on('hasmatchNotif', (data) => {
            setMatch(true);
        })

        socket.client.on('hasunlikeNotif', (data) => {
            setMatch(false);
            setFilledIcon(false);
        })

        socket.client.on('userDisconnect', (data) => {
            if(user.id == data.id) {
                user.status = true;
                const m2 = new Date(data.status);
                const date =
                    (m2.getUTCHours() + 1).toString() + ":" +
                    ("0" + m2.getUTCMinutes()).slice(-2) + ":" +
                    ("0" + m2.getUTCSeconds()).slice(-2) + " " +
                    m2.getUTCDate() + "/" +
                    ("0" + (m2.getUTCMonth()+1)).slice(-2) + "/" +
                    m2.getUTCFullYear();
                setDate(date);
            }
        })

        socket.client.on('userConnect', (data) => {
            if (user.id == data)
            {
                user.status = null;
                setDate(null);
            }
        })

        return () => {
            socket.client.off('hasmatchNotif');
            socket.client.off('hasunlikehNotif');
            socket.client.off('userDisconnect');
            socket.client.off('userConnect');
        };
    }, [user, date]);


    return (
        <>
            {
                currentUser.id !== Number(user.id)
                    ?
                    <>
                        <div className='flex ml-auto sm:p-2'>
                            <Chip
                                size='small'
                                label={user.status ? date : 'online'}
                                icon={<GoPrimitiveDot />}
                                className={`w-fit ${user.status ? 'bg-gray-400' : 'bg-green-400'}`}
                                sx={{
                                    '& .MuiChip-icon': {
                                        color: `${user.status ? 'gray' : 'green'}`,
                                    }
                                }}
                            />
                            <div className="tooltip" data-tip="Block">
                                <NoSymbolIcon onClick={blockUser} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                            </div>
                            {
                                filledIcon || filled
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
                                isMatched || match
                                    ?
                                    <div className="tooltip" data-tip="Start chatting">
                                        <ChatBubbleLeftIcon onClick={(event) => gotochat(event)} className='h-6 w-6 text-red-500 hover:text-blue-700 hover:cursor-pointer' />
                                    </div>
                                    :
                                    null
                            }
                        </div>

                    </>
                    :
                    null
            }
        </>
    );
}

export default InteractionButtons;