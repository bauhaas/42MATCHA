import ActiveConversations from './Components/ActiveConversations';
import NavBar from '../Navbar/NavBar';
import Testing from './Components/Testing';
import socket from '../../Context/socket'
import CardsMap from './Components/CardsMap';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';

//TODO socket file
// export const socket2 = io('http://localhost:3001', {  autoConnect:false });

//doesnt work with manager idk why
// export const manager = new Manager("http://localhost:3001", {autoConnect: false});
// export const socket = manager.socket("/");

const Home = () => {
	console.log("Home");
	// let navigate = useNavigate();
	const user = useSelector((state) => state.user.user);
	// const socket = socketIO.connect('http://localhost:3001', { query: `token=${localStorage.getItem('jwt')}` });

	// const manager = new Manager("http://localhost:3001", { autoConnect: false, query: `token=${localStorage.getItem('jwt')}` });
	// const socket = manager.socket("/");
	// const socket2 = io('http://localhost:3001', { autoConnect: false, query: `token=${localStorage.getItem('jwt')}` });
	// socket2.connect();
	// console.log(socket2);
		// socket.connect('lol');
		// const socket = io("http://localhost:3001", { autoConnect: false });
		// 	manager.open((err) => {
		// 	if (err) {
		// 		console.log('error');

		// 	} else {
		// 		console.log('success');
		// 	}
		// });
		// socket.connect();
	// 	manager.connect();

	return(
		<>
			<div className="bg-chess-default min-h-screen">
				<NavBar/>
				<CardsMap/>
				<ActiveConversations />
				<Testing />
			</div>
		</>
	)
}

export default Home;