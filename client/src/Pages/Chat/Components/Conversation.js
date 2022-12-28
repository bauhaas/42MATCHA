import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import socket from '../../../Context/socket';
import axios from 'axios';

import Avatar from '../../../SharedComponents/Avatar';
import MessageBubble from './MessageBubble';
import NavBar from '../../Navbar/NavBar';

const Conversation = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useSelector((state) => state.user.user);
    const conversation = location.state.conv;

    const [messageToSend, setMessageToSend] = useState("");
    const [otherUser, setOtherUser] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(null);

    const gobacktoconv = (event) => {
        event.preventDefault();
        navigate('/chat');
    }

    const sendMessage = (event, message) => {
        const otherUserId = (currentUser.id === conversation.userid2 ? conversation.userid1 : conversation.userid2)
        socket.emit('sendMessage', { from: currentUser.id, to: otherUserId, content: message });
    }

    const patchMessagesAsRead =  () => {
        axios.patch(`http://localhost:3001/messages/${conversation.id}`)
            .then(response => {
                console.log('success patch messages');
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        console.log('dm useEffect', conversation);
        setOtherUser(conversation.you_talk_to);

        const getMessageHistory = async () => {
            axios.get(`http://localhost:3001/messages/history/${conversation.id}`)
                .then(response => {
                    const updatedMessages = response.data.map((message) => ({
                        ...message,
                        unread: false,
                    }));
                    setMessages(updatedMessages);
                    patchMessagesAsRead();
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getMessageHistory();
    }, []);

    useEffect(() => {
        socket.client.on('messageHistory', (data) => {
            setMessages(data);
        })
        return () => {
            socket.client.off('messageHistory');
        };
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat messages
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }, []);


    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar />
                <div className='flex gap-2 mx-2 pt-16 h-screen'>
                    <div className='flex  flex-col grow relative bg-chess-place-text m-2 rounded-lg border-gray-600 border-2'>
                        <div className='bg-white p-2 rounded-t-lg'>
                            <div className='flex  items-center gap-2'>
                                <button onClick={gobacktoconv} className="btn btn-sm btn-circle mr-auto bg-chess-button hover:bg-chess-hover">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                    </svg>
                                </button>
                                <p>{otherUser}</p>
                                <Avatar width={10} attribute={'avatar'}/>
                            </div>
                        </div>
                        {
                            messages ?
                                <div className='overflow-y-scroll h-full w-full' ref={messagesRef}>
                                    {
                                        messages.map((message, index) => (
                                            <div>
                                                <MessageBubble message={message}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            :
                                null
                        }
                        <div className='flex items-center gap-2 w-full p-2'>
                            <input
                            onChange={(event) => setMessageToSend(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.keyCode === 13) {
                                    sendMessage(event, messageToSend);
                                }
                            }}
                            type="text" placeholder="Type here" className="input text-black grow" />
                            <PaperAirplaneIcon onClick={(event)=>{sendMessage(event, messageToSend)}}className={`h-8 w-8 text-white`} aria-hidden="true" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Conversation;