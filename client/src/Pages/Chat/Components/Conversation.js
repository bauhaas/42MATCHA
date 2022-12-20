import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import NavBar from '../../Navbar/NavBar';
import { useNavigate } from 'react-router-dom';


const Conversation = () => {

    const navigate = useNavigate();

    function gobacktoconv(event)
    {
        event.preventDefault();
        navigate('/chat');
    }

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
                                <p>Obi-Wan Kenobi</p>
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
                            <input type="text" placeholder="Type here" className="input text-black grow" />
                            <PaperAirplaneIcon className={`h-8 w-8 text-white`} aria-hidden="true" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Conversation;