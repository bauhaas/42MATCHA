import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Avatar from "../../../SharedComponents/Avatar";

const ConvCard = ({conv}) => {

    const currentUser = useSelector((state) => state.user.user);

    const [convPartner, setConvPartner] = useState('');

    useEffect(() => {
        if (conv.userid2 === currentUser.id) {
             setConvPartner(conv.user1_name);
        } else {
            setConvPartner(conv.user2_name);
        }
    }, []);


    return (
        <>
            <div className={`flex bg-chess-dark rounded-lg gap-2 p-2 ${conv.last_message_unread && conv.last_message_author_id !== currentUser.id ? 'bg-red-500' : 'hover:bg-chess-hover'}`}>
                <Avatar width={6} attribute={'avatar'} />
                <div>
                    <p className='font-bold'>{convPartner}</p>
                    <p className='line-clamp-1'>{conv.last_message_author_id === currentUser.id ? 'You: ' : ''}{conv.last_message || "No messages yet"}</p>
                </div>
            </div>
        </>
    )
}



export default ConvCard;