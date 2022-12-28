import { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import NavBar from '../../Navbar/NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../../../Context/socket';
import { useSelector } from 'react-redux';


const Conversation = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const conversation = location.state.conv;
    const currentUser = useSelector((state) => state.user.user);

    const [otherUser, setOtherUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState("");
    const [messagePayload, setMessagePayLoad] = useState({});

    useEffect(() => {
        console.log('dm useEffect', conversation);
        setMessages(conversation.messages);
        setOtherUser(conversation.you_talk_to);
    }, []);

    function gobacktoconv(event)
    {
        event.preventDefault();
        navigate('/chat');
    }

    const sendMessage = (event, message) => {
        console.log("send message:", message);
        const otherUserId = currentUser.id === conversation.receiver_id ? conversation.sender_id : conversation.receiver_id
        setMessagePayLoad({from:currentUser.id, to:otherUserId, content:message});
        console.log(messagePayload);
        const test =  {from:currentUser.id, to:otherUserId, content:message}
        socket.emit('sendMessage',test);
    }

    useEffect(() => {
        socket.client.on('messageHistory', (data) => {
            console.log('received messageHistory event');
        })
        return () => {
            socket.client.off('messageHistory');
        };
    }, []);


    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar />
                <div className='flex gap-2 mx-2 pt-16 h-screen'>
                    <div className='grow relative bg-gray-500 m-2 rounded-lg border-gray-600 border-2'>
                        <div className='bg-gray-200 p-2 rounded-t-lg'>
                            <div className='flex  items-center gap-2'>
                                <button onClick={gobacktoconv} className="btn btn-sm btn-circle mr-auto bg-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                    </svg>
                                </button>
                                <p>{otherUser}</p>
                                <div className="avatar">
                                    <div className="w-10 rounded-full m-1">
                                        <img src="https://placeimg.com/192/192/people" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="chat chat-start">
                                <div className="chat-image avatar m-1">
                                    <div className="w-10 rounded-full">
                                        <img src="https://placeimg.com/192/192/people" alt="profile" />
                                    </div>
                                </div>
                                <div className="chat-header">
                                    Obi-Wan Kenobi
                                    <time className="text-xs opacity-50"> 12:45</time>
                                </div>
                                <div className="chat-bubble">You were the Chosen One!</div>
                            </div>
                            <div className="chat chat-end">
                                <div className="chat-image avatar m-1">
                                    <div className="w-10 rounded-full">
                                        <img src="https://placeimg.com/192/192/people" alt="profile" />
                                    </div>
                                </div>
                                <div className="chat-header">
                                    Anakin
                                    <time className="text-xs opacity-50"> 12:46</time>
                                </div>
                                <div className="chat-bubble">I hate you!</div>
                            </div>
                        </div>
                        <div className='flex absolute bottom-0 items-center gap-2 w-full p-2'>
                            <input onChange={(event) => setMessageToSend(event.target.value)} type="text" placeholder="Type here" className="input text-black grow" />
                            <PaperAirplaneIcon onClick={(event)=>{sendMessage(event, messageToSend)}}className={`h-8 w-8 text-white`} aria-hidden="true" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Conversation;