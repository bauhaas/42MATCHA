import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RiSendPlaneFill } from 'react-icons/ri'
import socket from '../../../Context/socket';
// import axios from 'axios';

import Avatar from '../../../SharedComponents/Avatar';
import MessageBubble from './MessageBubble';
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