import { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { useNavigate } from 'react-router-dom';
import ConvCard from './Components/ConvCard';

const Chat = () => {

    const [convlist, setConvList] = useState(['Obiwan', 'Anakin', 'Foo']);

    const navigate = useNavigate();

    function gotoConv(event, convName) {
        event.preventDefault();
        console.log('go to conv', convName)
        navigate(`/chat/${convName}`);
    }

    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar />
                <div className='flex gap-2 mx-2 mt-16 text-white h-screen'>
                    <div id="convList" className='grow rounded-lg'>
                        {
                            convlist.length > 0 ?
                                <ul className='flex flex-col gap-2'>
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