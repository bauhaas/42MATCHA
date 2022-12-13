import ActiveConversations from './ActiveConversations';
import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { socket } from '../App';

const Testing = () => {

    const sendNotif = (event) => {
        event.preventDefault();

        axios.post('http://localhost:3001/notifications', {
            sender_id: 1,
            user_id: 1,
            type:"sent via utils buttons",
        })
            .then(response => {
                // handle success
                console.log('send notif success');
                console.log(response.data);
            })
            .catch(error => {
                // handle error
                console.log(error);
                console.log(error.response.data);
            });
    }

    return (
        <>
            <div className='fixed bottom-0 left-0 border-red-400 border-2'>
                <div className='text-white text-2xl '>Utils buttons</div>
                <button onClick={sendNotif} className='bg-blue-500 border-2 border-blue-800'>send notifs</button>
            </div>

        </>
    )
}

export default Testing;