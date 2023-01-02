import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import SettingsHeader from './SettingsHeader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MatchedUsers = () => {

	const [matchedUsers, setmatchedUsers] = useState([]);
	const currentUser = useSelector((state) => state.user.user);

	const getMatchedUsers = () => {
		console.log(currentUser.id);
		axios.get(`http://localhost:3001/users/${currentUser.id}/matched`)
			.then(response => {
				setmatchedUsers(response.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	//unmatch a user
	const unmatchUser = (event, id) => {
		event.preventDefault();
		console.log('unmatch user', id);
		axios.post('http://localhost:3001/relations', {
			sender_id: currentUser.id,
			receiver_id: id,
			type: 'unlike'
		})
			.then(response => {
				console.log(response);
				getMatchedUsers();
			})
			.catch(error => {
				console.log(error);
			});
	}

	useEffect(() => {
		getMatchedUsers();
	}, []);

	return (
		<>
			<div className="bg-chess-default min-h-screen">
				<NavBar/>
				<div className='mx-2 pt-16 h-screen'>
					<SettingsHeader />
					<div className='flex gap-4 mt-2'>
						<SettingsMenu/>
						<div className='text-white bg-chess-dark p-4 rounded-lg max-w-3xl'>
							<span className='font-bold'>Matched Users</span>
							<p className='text-sm py-2 break-words'>
								A matched user is able to see your profile and send you messages. Unmatch a user will delete your chat history with him but you are able rematch
							</p>
							<div className="pt-2">
								<table className="text-white w-full text-left">
									<tbody>
										{matchedUsers.map((user, index) => (
											<tr className="border-b border-chess-bar text-xs">
												<td>
													{user.first_name} {user.last_name}
												</td>
												<td className="text-right">
													<button onClick={(event) => unmatchUser(event, user.id)}>Unmatch</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default MatchedUsers;