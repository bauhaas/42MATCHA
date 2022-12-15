import ActiveConversations from './ActiveConversations';
import { useEffect } from 'react';
import NavBar from './NavBar';
import Testing from './Testing';
import {io, Manager} from 'socket.io-client';
import CardsMap from './CardsMap';


//TODO socket file
export const socket2 = io('http://localhost:3001', { query: `token=${localStorage.getItem('jwt')}`, autoConnect:false });

//doesnt work with manager idk why
// export const manager = new Manager("http://localhost:3001", {autoConnect: false});
// export const socket = manager.socket("/");

const Home = () => {
	// let navigate = useNavigate();

	// const socket = socketIO.connect('http://localhost:3001', { query: `token=${localStorage.getItem('jwt')}` });



	useEffect(() => {
		console.log('try connect');
		socket2.connect();

		// manager.connect();

		// //same as manager.connect()
		// manager.open((err) => {
		// 	if (err) {
		// 		console.log('error');

		// 		// an error has occurred
		// 	} else {
		// 		console.log('success');

		// 		socket.on('connect', () => {
		// 			console.log('connected');});
		// 		// the connection was successfully established
		// 	}
		// });
	}, []);

	return(
		<>
			<div className="bg-gray-700 min-h-screen">
				<NavBar/>
				<CardsMap/>
				<ActiveConversations />
				<Testing />
			</div>
		</>
	)
}

export default Home;