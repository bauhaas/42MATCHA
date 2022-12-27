import io from "socket.io-client";

const URL = "http://localhost:3001";
const socket = {};

socket.connect = (id) => {
    socket.id = id;
    socket.client = io(URL, {query: `id=${id}`});
}

socket.disconnect = () =>{
    console.log('socket disconnect');
    socket.client.disconnect();
};

export default socket;
