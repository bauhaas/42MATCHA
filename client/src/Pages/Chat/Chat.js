import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import socket from '../../Context/socket';
// import axios from 'axios';
import api from '../../ax';
import ConvCard from './Components/ConvCard';
import NavBar from '../Navbar/NavBar';
import { updateConversation } from "../../convSlice";

const Chat = () => {

    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [convlist, setConvList] = useState([]);

    const patchMessagesAsRead = (conversation) => {
        api.patch(`http://localhost:3001/messages/${conversation.id}`)
            .then(response => {
                // Make a copy of the conversation object
                const updatedConversation = { ...conversation };
                // Modify the copy
                updatedConversation.last_message_unread = false;
                dispatch(updateConversation(updatedConversation));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const gotoConv = async (event, conv) => {
        event.preventDefault();
        patchMessagesAsRead(conv);
        navigate(`/chat/${conv.id}`, {
            state: { conv: conv}
          });
    }

    useEffect(() => {
        const getConversations = async () => {
            api.get(`http://localhost:3001/conversations/user/${currentUser.id}`)
                .then(response => {
                    setConvList(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getConversations();
    }, []);

    useEffect(() => {
        socket.client.on('convUpdate', (data) => {
            setConvList(data);
        })

        return () => {
            socket.client.off('convUpdate');
        };
    });

    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar />
                <div className='gap-2 pt-16 h-screen text-white'>
                        {
                            convlist.length > 0
                            ?
                                <div id = "convList" className = 'flex flex-col items-center gap-2 mx-4 rounded-lg pt-2 scrollbar overflow-auto'>
                                    {convlist.map((conv, index) => (
                                        <div className="min-w-full" onClick={(event) => gotoConv(event, conv)} key={`${conv}-${index}`} >
                                            <ConvCard conv={conv} />
                                        </div>
                                    ))}
                                </div>
                            :
                                <div className='text-center font-bold text-2xl'>No conversations</div>
                        }

                </div>
            </div>
        </>
    )
}

export default Chat;