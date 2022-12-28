import { useState, useEffect } from 'react';
import NavBar from '../Navbar/NavBar';
import { useNavigate } from 'react-router-dom';
import ConvCard from './Components/ConvCard';
import Conversation from './Components/Conversation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Chat = () => {

    const [convlist, setConvList] = useState([]);

    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);

    function gotoConv(event, conv) {
        event.preventDefault();
        console.log('go to conv', conv.id)
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