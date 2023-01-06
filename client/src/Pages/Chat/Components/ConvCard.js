import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Avatar from "../../../SharedComponents/Avatar";

const ConvCard = ({conv}) => {

    const currentUser = useSelector((state) => state.user.user);

    const [convPartner, setConvPartner] = useState('');
    const [convPartnerPath, setConvPartnerPath] = useState('');

    useEffect(() => {
        if (conv.userid2 === currentUser.id) {
             setConvPartner(conv.user1_name);
            setConvPartnerPath(conv.user1_file_path);
        } else {
            setConvPartner(conv.user2_name);
            setConvPartnerPath(conv.user2_file_path);
        }
    }, []);

    return (
        <>
            <div className={`flex bg-chess-dark rounded-lg gap-2 p-2 ${conv.last_message_unread && conv.last_message_author_id !== currentUser.id ? 'bg-red-500' : 'hover:bg-chess-hover'}`}>
                <div className='indicator'>
                    <span className="indicator-item badge indicator-bottom indicator-start m-2 bg-blue-500"></span>
                    <Avatar imageAttribute={'rounded-full w-12'} attribute={'avatar'} imagePath={convPartnerPath}/>
                </div>
                <div>
                    <p className='font-bold'>{convPartner}</p>
                    <p className='line-clamp-1'>{conv.last_message_author_id === currentUser.id ? 'You: ' : ''}{conv.last_message || "No messages yet"}</p>
                </div>
            </div>
        </>
    )
}

export default ConvCard;