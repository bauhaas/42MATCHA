import React from 'react';

import NavBar from '../../Navbar/NavBar';
import Conversation2 from './Conversation2';

const Conversation = () => {
    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar />
                <Conversation2 />
            </div>
        </>
    )
}

export default Conversation;