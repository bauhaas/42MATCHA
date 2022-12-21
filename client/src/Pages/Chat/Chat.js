import { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { useNavigate } from 'react-router-dom';
import ConvCard from './Components/ConvCard';
import Conversation from './Components/Conversation';

const Chat = () => {

    const [convlist, setConvList] = useState(['Obiwan', 'Anakin', 'Foo', 'Anakin', 'Foo', 'Anakin', 'Foo', 'Anakin', 'Foo', 'Anakin', 'Foo']);

    const navigate = useNavigate();

    function gotoConv(event, convName) {
        event.preventDefault();
        console.log('go to conv', convName)
        navigate(`/chat/${convName}`);
    }

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