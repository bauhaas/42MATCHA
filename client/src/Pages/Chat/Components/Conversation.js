import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RiSendPlaneFill } from 'react-icons/ri'
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

    const [convPartner, setConvPartner] = useState('');
    const [convPartnerPath, setConvPartnerPath] = useState('');
    const [partnerStatus, setpartnerStatus] = useState(false);
    const [partnerID, setpartnerID] = useState(false);
    const [messageToSend, setMessageToSend] = useState("");
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

    const patchMessagesAsRead = (conversation) => {
        console.log('patchMessagesAsRead')
        axios.patch(`http://localhost:3001/messages/${conversation.id}`)
            .then(response => {
                console.log('success patch messages');
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (conversation.userid2 === currentUser.id)
        {
            setConvPartner(conversation.user1_name);
            setConvPartnerPath(conversation.user1_file_path);
            setpartnerID(conversation.userid1);
            if (conversation.user1_status === null)
                setpartnerStatus(true);
        }
        else
        {
            setConvPartner(conversation.user2_name);
            setConvPartnerPath(conversation.user2_file_path);
            setpartnerID(conversation.userid2);
            if (conversation.user2_status === null)
                setpartnerStatus(true);
        }

        const getMessageHistory = async () => {
            axios.get(`http://localhost:3001/messages/history/${conversation.id}`)
                .then(response => {
                    console.log('ger message history');
                    setMessages(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getMessageHistory();
    }, []);

    useEffect(() => {
        socket.client.on('messageHistory', (data) => {
            console.log('receive messagehistory event', data);
            setMessages(data);
            patchMessagesAsRead(conversation);
        })

        socket.client.on('userDisconnect', (data) => {
            if (partnerID == data) {
                setpartnerStatus(false);
                console.log('user has disconnect', data)
            }
        })

        socket.client.on('userConnect', (data) => {
            console.log(partnerID, data);
            if (partnerID == data) {
                setpartnerStatus(true);
                console.log('user has connect', data)
            }
        })

        return () => {
            socket.client.off('messageHistory');
            socket.client.off('userDisconnect');
            socket.client.off('userConnect');
        };
    }, []);

    console.log(conversation);
    useEffect(() => {
        if(messages)
            messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }, [messages]);

    console.log(conversation, messages);
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
                                <p>{convPartner}</p>
                                <div className='indicator'>
                                    <span className={`indicator-item badge indicator-bottom indicator-start m-2 ${partnerStatus ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                    <Avatar imageAttribute={'rounded-full w-12'} attribute={'avatar'} imagePath={convPartnerPath} />
                                </div>
                            </div>
                        </div>
                        {
                            messages ?
                                <div className='overflow-y-auto scrollbar-hide h-full w-full' ref={messagesRef}>
                                    {
                                        messages.map((message, index) => (
                                            <div>
                                                <MessageBubble message={message} picture={convPartnerPath}/>
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
                                    event.target.value = '';
                                }
                            }}
                            type="text" placeholder="Type here" className="input text-black grow" />
                            <RiSendPlaneFill onClick={(event) => { sendMessage(event, messageToSend); document.querySelector('.input').value = ''; }}className={`h-8 w-8 text-white`} aria-hidden="true" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Conversation;