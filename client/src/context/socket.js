import io from "socket.io-client";
import React from 'react';

export const socket = io('http://localhost:3001', { autoConnect: false, query: `token=${localStorage.getItem('jwt')}` });
export const SocketContext = React.createContext();