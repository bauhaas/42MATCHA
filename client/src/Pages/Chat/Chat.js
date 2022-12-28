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
        const getConversations = async () => {
            axios.get(`http://localhost:3001/conversations/${currentUser.id}`)
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
            console.log('receive convUpdate event', data)
            setConvList(data);
        })

        return () => {
            socket.client.off('convUpdate');
        };
    }, []);

    //TODO size box
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