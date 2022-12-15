import ActiveConversations from './ActiveConversations';
import { useEffect } from 'react';
import NavBar from './NavBar';
import Testing from './Testing';
import {io, Manager} from 'socket.io-client';
import CardsMap from './CardsMap';


//TODO socket file
// export const socket2 = io('http://localhost:3001', {  autoConnect:false });

//doesnt work with manager idk why
// export const manager = new Manager("http://localhost:3001", {autoConnect: false});
// export const socket = manager.socket("/");

const Home = () => {
	// let navigate = useNavigate();

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
	// console.log(socket);

	useEffect(() => {
		console.log('try connect');

		// socket.on('connection', () => {
		// 	console.log('connected');
		// });
		// // the connection was successfully established

		// socket.on("connect_error", (err) => {
		// 	console.log(`connect_error due to ${err.message}`);
		// });


		// if (localStorage.getItem('jwt'))
		// {
		// 	console.log(`socket gonna connect with token=${localStorage.getItem('jwt')}`);
		// 	const token = localStorage.getItem('jwt');
		// 	const query = { token };
		// 	console.log('query:', query);
		// 	query.token = token;
		// 	socket2.connect({ query });
		// }
		// else
		// 	console.log('didnt find the jwt');

		// socket2.on('connection', () => {
		// 	console.log('connected');
		// });
		// // the connection was successfully established

		// socket2.on("connect_error", (err) => {
		// 	console.log(`connect_error due to ${err.message}`);
		// });
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