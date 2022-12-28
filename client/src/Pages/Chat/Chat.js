import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import socket from '../../Context/socket';
import axios from 'axios';

import ConvCard from './Components/ConvCard';
import NavBar from '../Navbar/NavBar';


const Chat = () => {

    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const [convlist, setConvList] = useState([]);

    const gotoConv = async (event, conv) => {
        event.preventDefault();
        navigate(`/chat/${conv.id}`, {
            state: {
              conv: conv,
            }
          });
    }

    useEffect(() => {
        console.log('chat useEffect');

        const getConversations = async () => {
            console.log(currentUser.id);
            axios.get(`http://localhost:3001/conversations/${currentUser.id}`)
                .then(response => {
                    const conversations = response.data;
                    setConvList(conversations);
                    console.log(conversations);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getConversations();
    }, []);

    useEffect(() => {
        socket.client.on('convUpdate', (data) => {
            console.log('receive message history event in chat page', data)
            setConvList(data);
        })
        return () => {
            socket.client.off('convUpdate');
        };
    }, []);

    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar />
                <div className='flex gap-2 mx-2 pt-16 h-screen text-white'>
                    <div id="convList" className='grow rounded-lg pt-2 scrollbar overflow-auto sm:px-80'>
                        {
                            convlist.length > 0 ?
                                <ul className='flex flex-col gap-2 pr-2'>
                                    {convlist.map((conv, index) => (
                                        <div onClick={(event) => gotoConv(event, conv)} key={`${conv}-${index}`} >
                                            <ConvCard conv={conv} />
                                        </div>
                                    ))}
                                </ul>
                            :
                                <div className='text-center font-bold text-2xl'>No conversations</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;