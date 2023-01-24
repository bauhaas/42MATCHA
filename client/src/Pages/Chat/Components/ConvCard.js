import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Avatar from "../../../SharedComponents/Avatar";
import socket from '../../../Context/socket'

const ConvCard = ({conv}) => {

    const currentUser = useSelector((state) => state.user.user);

    const [convPartner, setConvPartner] = useState('');
    const [convPartnerPath, setConvPartnerPath] = useState('');
    const [partnerStatus, setpartnerStatus] = useState(false);
    const [partnerID, setpartnerID] = useState(false);

    useEffect(() => {
        if (conv.userid2 === currentUser.id) {
            setConvPartner(conv.user1_name);
            setpartnerID(conv.userid1);
            setConvPartnerPath(conv.user1_file_path);
            if(conv.user1_status === null)
                setpartnerStatus(true);
        } else {
            setConvPartner(conv.user2_name);
            setConvPartnerPath(conv.user2_file_path);
            setpartnerID(conv.userid2);
            if (conv.user2_status === null)
                setpartnerStatus(true);
        }
    }, []);

    useEffect(() => {
        socket.client.on('userDisconnect', (data) => {
            if (partnerID == data.id) {
                setpartnerStatus(false);
            }
        })

        socket.client.on('userConnect', (data) => {
            if (partnerID == data) {
                setpartnerStatus(true);
            }
        })

        return () => {
            socket.client.off('userDisconnect');
            socket.client.off('userConnect');
        };
    });

    return (
        <>
            <div className={`flex bg-chess-dark rounded-lg gap-2 p-2 ${conv.last_message_unread && conv.last_message_author_id !== currentUser.id ? 'bg-red-500' : 'hover:bg-chess-hover'}`}>
                <div className='indicator'>
                    <span className={`indicator-item badge indicator-bottom indicator-start m-2 ${partnerStatus ? 'bg-green-600': 'bg-gray-400'}`}></span>
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