import ActiveConversations from './ActiveConversations';
import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Testing from './Testing';
// import { useNavigate} from 'react-router-dom';
import ProfileCard from './ProfileCard';
import axios from 'axios';
import { socket } from '../App';

const Menu = () => {
	// let navigate = useNavigate();

	const [users, setUsers] = useState([]);

	// Fetch the users data from the backend when the component mounts
	useEffect(() => {
		axios.get('http://localhost:3001/users')
			.then(response => {
				// Set the users state variable to the data from the response
				setUsers(response.data);
			})
			.catch(error => {
				// Handle any errors that occurred while fetching the data
				console.error(error);
			});
	}, []);


	// useEffect(() => {
	// 	const token = localStorage.getItem('jwt');
	// 	console.log(token);
	// 	socket.emit('getNotifications', {token:token});

	// 	return () => {
	// 	};
	// }, []);

	// useEffect(() => {
	// 	socket.on('sendNotifications', (data) => {
	// 		console.log(data);
	// 	});

	// 	return () => {
	// 		socket.off('sendNotifications');
	// 	};
	// }, []);



	return(
	<>
			<div className="bg-gray-700 min-h-screen">
				<NavBar/>
				<div className='mt-16'>
					<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
						{users.map((user, index) => (
							<li key={user + index} id={user + index} className="scale-90">
								<ProfileCard user={user} />
							</li>
						))}
					</ul>
				</div>
				<ActiveConversations />
				<Testing />
			</div>
		</>
	)
}

export default Menu;