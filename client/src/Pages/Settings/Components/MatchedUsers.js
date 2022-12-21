import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import SettingsHeader from './SettingsHeader';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MatchedUsers = () => {

	const [matchedUsers, setmatchedUsers] = useState([{ first_name: 'test', last_name: 'test' }, { first_name: 'hardcoded', last_name: 'hardcoded' }]);

	const getMatchedUsers = () => {
		console.log('get matched users');

		// axios.get(`http://localhost:3001/block/${currentUser.id}/users`)
		// 	.then(response => {
		// 		setBlockedUsers(response.data);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});
	}

	//unblock a user
	const unmatchUser = (event, id) => {
		event.preventDefault();
		console.log('unmatch user', id);
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
					<div className='flex gap-4 mt-2 sm:mx-40'>
						<SettingsMenu/>
						<div className='text-white bg-chess-dark p-4 rounded-lg'>
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
													<button onClick={(event) => unmatchUser(event, user.blocked_id)}>Unmatch</button>
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